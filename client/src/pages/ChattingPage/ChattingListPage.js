import React, {useEffect, useState, useMemo} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import WalletButton from '../../components/common/WalletButton';
import {useIsFocused} from '@react-navigation/native';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import {handleDate, handleDateInFormat} from '../../utils/common/Functions';
import {getItem, setItem} from '../../lib/Chatting';

function ChattingListPage({navigation}) {
  const [chatLog, setChatLog] = useState('');
  const [refresh, setRefresh] = useState(false);
  const user = useUser();
  const isFocused = useIsFocused();

  useEffect(() => {
    const getChatLogs = async () => {
      const meetingList = [];
      // console.log({user});
      const rawUserInfo = await firestore()
        .collection('User')
        .doc(user.id)
        .get();
      // console.log({rawUserInfo});
      const userInfo = rawUserInfo.data();
      // console.log({userInfo});
      userInfo.createdroomId && meetingList.push(...userInfo.createdroomId);
      userInfo.joinedroomId && meetingList.push(...userInfo.joinedroomId);

      const meetingInfos = await Promise.all(
        meetingList.map(async (meetingId, idx) => {
          const meetingInfo = await firestore()
            .collection('Meeting')
            .doc(meetingId)
            .get();

          const lastMsg = await firestore()
            .collection('Meeting')
            .doc(meetingId)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

          const hostImage = await firestore()
            .collection('User')
            .doc(meetingInfo.data().hostId)
            .get();

          return {
            ...meetingInfo.data(),
            id: meetingId,
            hostInfo: hostImage.data().nftProfile,
            lastMsg: lastMsg.docs[0] && lastMsg.docs[0].data(),
          };
        }),
      );

      setChatLog(meetingInfos);
    };
    getChatLogs();
  }, [user, refresh, isFocused]);

  return (
    <View style={styles.view}>
      <SafeStatusBar />
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 0.3, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.header}>
          <Text style={styles.title}>채팅</Text>
        </View>
        {chatLog.length === 0 ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={{color: 'lightgray'}}>채팅이 없습니다</Text>
          </View>
        ) : (
          <FlatList
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            data={chatLog.sort((a, b) => {
              let lastA;
              let lastB;
              a.lastMsg ? (lastA = a.lastMsg.createdAt) : (lastA = a.createdAt);
              b.lastMsg ? (lastB = b.lastMsg.createdAt) : (lastB = b.createdAt);
              return lastB - lastA;
            })}
            renderItem={({item}) => (
              <MetaData
                item={item}
                navigation={navigation}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            )}
            contentContainerStyle={styles.chattingContainer}
          />
        )}
      </LinearGradient>
      <WalletButton />
    </View>
  );
}

function MetaData({item, navigation, refresh, setRefresh}) {
  const user = useUser();
  const [lastMsg, setLastMsg] = useState('');
  const [lastTime, setLastTime] = useState('');
  const [allMsgs, setAllMsgs] = useState('');
  const [unChecked, setUnChecked] = useState(0);
  const [last, setLast] = useState('');
  const [msgs, setMsgs] = useState('');

  // 페이지 열 때 한번만 실행되는 useEffect
  // AsyncStorage에 정보가 없으면 만들어주고, 있다면 받아와서 allMsgs에 넣어주는 역할을 한다.
  useEffect(() => {
    getItem(item.id).then(result => {
      // AsyncStorage에 없으면(방금 만들거나 입장한 미팅룸이면) id를 가지고 data를 만들어준다.
      if (result === null) {
        const earlySetting = async () => {
          const firstMsg = await firestore()
            .collection('Meeting')
            .doc(item.id)
            .collection('Messages')
            .where('nickName', '==', user.nickName)
            .get();
          if (firstMsg.docs.length === 0) {
            setItem(item.id, [{checked: 0}]);
            setAllMsgs([{checked: 0}]);
          } else {
            setItem(item.id, [{checked: 0}, firstMsg.docs[0].data()]);
            setAllMsgs([{checked: 0}, firstMsg.docs[0].data()]);
          }
        };
        earlySetting();
      } else {
        // console.log(result);
        if (result.length === 1) {
          const getDatas = async () => {
            const msgs = await firestore()
              .collection('Meeting')
              .doc(item.id)
              .collection('Messages')
              .orderBy('createdAt')
              .get();
            if (msgs.docs.length === 0) {
              setAllMsgs(result);
            } else {
              const datas = msgs.docs.map(el => {
                return el.data();
              });
              const all = result.concat(datas);
              setAllMsgs(all);
              setItem(item.id, all);
              setUnChecked(all.length - 1);
            }
          };
          return getDatas();
        } else {
          const getAfterMsgs = async () => {
            const lastTime = firestore.Timestamp.fromDate(
              new Date(result[result.length - 1].createdAt.seconds * 1000.0001),
            );
            const msgs = await firestore()
              .collection('Meeting')
              .doc(item.id)
              .collection('Messages')
              .where('createdAt', '>', lastTime)
              .orderBy('createdAt')
              .get();
            if (msgs.docs.length === 0) {
              // console.log(result);
              return setAllMsgs(result);
            }
            const datas = msgs.docs.map(el => {
              return el.data();
            });
            const all = result.concat(datas);
            setAllMsgs(all);
            setItem(item.id, all);
            setUnChecked(all.length - result[0].checked);
          };
          return getAfterMsgs();
        }
      }
    });
    // console.log(allMsgs);
  }, []);

  // firestore를 통해 lastMsg가 업데이트되면 AsyncStorage에 lastMsg를 업데이트해주는 함수
  useEffect(() => {
    if (allMsgs === '') {
      return;
    }
    setUnChecked(unChecked + 1);
    setAllMsgs([...allMsgs, last]);
    setItem(item.id, [...allMsgs, last]);
    // setUnChecked(unChecked + 1);
  }, [lastTime.seconds]);

  // firestore에서 새로운 msg를 받아서 lastMsg를 업데이트해주는 함수
  useEffect(() => {
    const getContent = firestore()
      .collection('Meeting')
      .doc(item.id)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .onSnapshot(result => {
        if (result.docs.length === 0) {
          return;
        } else if (
          result.docChanges()[result.docChanges().length - 1].doc._data
            .createdAt
        ) {
          if (result.docs[0].data().status) {
            return;
          }

          setLast(result.docs[0].data());
          setLastMsg(result.docs[0].data().text);
          setLastTime(result.docs[0].data().createdAt);
        }
      });

    setRefresh(!refresh);

    return () => getContent;
  }, [lastTime.seconds]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ChattingRoom', {data: item});

        setUnChecked(0);
        const temp = [...allMsgs];
        temp[0].checked = allMsgs.length;
        // console.log(temp);
        setItem(item.id, temp);
      }}>
      <View style={styles.container}>
        <Image style={styles.image} source={{uri: item.hostInfo}} />
        <View style={styles.chatInfo}>
          <View>
            <Text style={styles.titleText} numberOfLines={1}>
              {item.title.length > 14
                ? item.title.slice(0, 14) + '...'
                : item.title}
            </Text>
            <Text numberOfLines={1} style={styles.plainText}>
              {lastMsg ? lastMsg : '채팅을 시작해보세요!'}
            </Text>
          </View>
          <View style={styles.date}>
            <Text style={styles.dateText}>
              {lastTime ? handleDate(lastTime) : ''}
            </Text>
            <Text style={{color: 'white'}}>{unChecked && unChecked}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    height: 80,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  container: {
    flexDirection: 'row',
    height: 60,
    // paddingLeft: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginTop: 8,
    // justifyContent: 'space-between',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#58FF7D',
    borderWidth: 1,
  },
  chatInfo: {
    flexDirection: 'row',
    height: '100%',
    width: '80%',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingTop: 6,
    flexWrap: 'wrap',
  },
  separator: {
    backgroundColor: '#AEFFC1',
    height: 1,
  },
  titleText: {
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  chattingContainer: {
    paddingBottom: 70,
  },
  plainText: {
    fontSize: 15,
    color: '#ffffff',
    maxWidth: 150,
  },
  dateText: {
    fontSize: 12,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  date: {alignItems: 'flex-start'},
});

export default ChattingListPage;
