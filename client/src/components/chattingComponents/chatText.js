import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  AppState,
  Platform,
} from 'react-native';
import AddChat from './addChat';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';
import UserInfoModal from '../common/UserInfoModal';
import person from '../../assets/icons/person.png';
import {getItem, setItem} from '../../lib/Chatting';
import * as RNFS from 'react-native-fs';
import {downloadFile, checkExist} from '../../lib/api/caching';

function ChatText({
  data,
  roomInfo,
  userDetail,
  setRoomInfo,
  userInfoModalVisible,
  setUserInfoModalVisible,
  userId,
  setUserId,
}) {
  const [chattings, setChattings] = useState('');
  const [lastChat, setLastChat] = useState('');
  const [currentAppState, setCurrentAppState] = useState('');
  const userDesc = useUser();
  const user = userDesc.id;
  const visibleList = userDesc.visibleUser;
  const appState = useRef(AppState.currentState);

  const renderItem = ({item, idx}) =>
    item.status ? (
      <StatusMessage item={item} />
    ) : item.sender === user ? (
      <MyChat item={item} user={userDesc} userDetail={userDetail} key={idx} />
    ) : (
      <NotMyChat
        setUserId={setUserId}
        item={item}
        userDetail={userDetail}
        setUserInfoModalVisible={setUserInfoModalVisible}
        key={idx}
      />
    );

  const chatRef = useMemo(
    () => firestore().collection('Meeting').doc(data.id).collection('Messages'),
    [data.id],
  );
  const checkIsVisible = userId => {
    // console.log(visibleList)
    if (!visibleList) {
      return false;
    }
    if (visibleList.indexOf(userId) !== -1) {
      return true;
    }
    return false;
  };

  // 채팅방에 들어올 때, AsyncStorage로부터 데이터를 받아와 chattings에 넣어주는 함수
  useEffect(() => {
    console.log();
    // AppState Subscribe 설정
    const subscription = AppState.addEventListener('change', changedState => {
      if (
        (currentAppState === 'inactive' || 'background') &&
        changedState === 'active'
      ) {
        console.log('App state changed from inactive to active!!');
      }
      // console.log(currentAppState);
      // console.log(changedState);
      appState.current = changedState;
      setCurrentAppState(appState.current);
    });
    getItem(data.id).then(result => {
      setChattings(result.slice(1));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // 앱의 상태 변경(foreground, background)에 따라 채팅창을 업데이트해주는 함수
  useEffect(() => {
    if (!currentAppState) return;
    if (currentAppState === 'inactive' || currentAppState === 'background') {
      console.log('out');
      return;
    } else if (currentAppState === 'active') {
      // 시간 범위를 체크하여 그 사이에 온 채팅이 있는지 판단하고, 있다면 업데이트해주는 함수
      console.log('in');
      const Time =
        chattings.length > 0 &&
        firestore.Timestamp.fromDate(
          new Date(chattings[chattings.length - 1].createdAt.seconds * 1000),
        );
      firestore()
        .collection('Meeting')
        .doc(data.id)
        .collection('Messages')
        .where('createdAt', '>', Time)
        .orderBy('createdAt')
        .get()
        .then(result => {
          if (result.docs.length > 1) {
            const data = result.docs.map(el => {
              return el.data();
            });
            setChattings(chattings.concat(data.slice(1, data.length - 1)));
          }
        });

      // console.log(chattings);
    }
  }, [currentAppState]);

  // lastChat이 변경되면 이를 토대로 전체 채팅 list를 변경해주는 함수
  useEffect(() => {
    if (
      lastChat === '' ||
      currentAppState === 'inactive' ||
      currentAppState === 'background'
    ) {
      return;
    } else {
      if (chattings.length === 0) {
        setChattings(lastChat);
      } else if (
        chattings[chattings.length - 1].createdAt.seconds ===
        lastChat.createdAt.seconds
      ) {
        return;
      }
      const temp = [...chattings];
      temp.push(lastChat);
      setChattings(temp);
    }
  }, [lastChat]);

  // firebase에서 live로 마지막 채팅을 받아오는 함수, lastChat에다가 저장해줌
  useEffect(() => {
    // legacy;
    const getContent = chatRef
      .orderBy('createdAt', 'desc')
      .limit(1)
      .onSnapshot(result => {
        if (result.docs.length === 0) {
          return;
        } else if (
          result.docChanges()[result.docChanges().length - 1].doc._data
            .createdAt
        ) {
          const data = result.docs[0].data();
          setLastChat(data);
          // setChattings(data);
        }
      });

    return () => getContent;
  }, []);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <FlatList
        // horizontal={true}
        // 플랫리스트에서 하단부터 렌더링을 해주는 설정
        // windowSize => https://codingbroker.tistory.com/110
        windowSize={999}
        removeClippedSubviews={true}
        inverted={true}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          flexDirection: 'column-reverse',
        }}
        style={styles.container}
        data={chattings}
        renderItem={renderItem}
      />
      <UserInfoModal
        userInfoModalVisible={userInfoModalVisible}
        setUserInfoModalVisible={setUserInfoModalVisible}
        userId={userId}
        visible={checkIsVisible(userId)}
      />
      <AddChat chatId={data.id} roomInfo={data} />
      {roomInfo && (
        <Pressable
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
          onPress={() => {
            setRoomInfo(false);
          }}
        />
      )}
    </View>
  );
}

function NotMyChat({item, userDetail, setUserInfoModalVisible, setUserId}) {
  const [date, setDate] = useState('');
  const [userImg, setUserImg] = useState('');

  useEffect(() => {
    // console.log(item.createdAt);
    console.log(userDetail);
    console.log(item);
    if (userDetail[item.sender]) {
      const path =
        Platform.OS === 'android'
          ? `file://${RNFS.CachesDirectoryPath}/${item.sender}.png`
          : `${RNFS.CachesDirectoryPath}/${item.sender}.png`;

      // hostImg에 uri를 넣어주는 함수
      const fileSet = uri => {
        setUserImg(uri);
      };

      // uri로부터 파일을 다운받아 캐시폴더에 넣어주는 함수
      const downloadFile = uri => {
        RNFS.downloadFile({
          fromUrl: uri,
          toFile: path,
        }).promise.then(() => fileSet(path));
      };

      // 캐시폴더에 hostId이름으로 된 png 파일이 있는지 확인 후, 있다면 바로 로드, 없으면 캐시 폴더에 저장해주기

      RNFS.exists(path).then(result => {
        if (result) {
          // console.log('it is exists');
          // console.log(path);
          fileSet(path);
        } else {
          // console.log('it is not exists');
          downloadFile(userDetail[item.sender].nftProfile);
        }
      });
    }
  }, [userDetail]);

  useEffect(() => {
    const date = new Date(item.createdAt.seconds * 1000).toLocaleString();
    setDate(date);
  }, []);
  return (
    userDetail && (
      <View style={styles.messageWrapper}>
        {/* 클릭할 시 유저 정보를 열겠냐고 물어보는 모달 창 띄우는 값 true로 설정 */}
        {userDetail && userDetail[item.sender] ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setUserId(item.sender);
              setUserInfoModalVisible(true);
            }}>
            {userImg ? (
              <Image
                source={
                  userDetail && {
                    uri: userImg,
                  }
                }
                style={styles.image}
              />
            ) : (
              <View style={styles.image} />
            )}
          </TouchableOpacity>
        ) : (
          <Image source={person} style={styles.image} />
        )}
        {/* <InquireUserProfile
        width={60}
        height={60}
        margin={[10, 3, 3, 3]}
        userId={item.data().sender}
      /> */}

        <View style={styles.textWrapper}>
          <Text style={styles.senderName}>
            {userDetail && userDetail[item.sender]
              ? userDetail[item.sender].nickName
              : '(알수없음)'}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <View style={styles.messageBody}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
            <View style={styles.date}>
              <Text style={styles.dateText}>
                {date && date.slice(6, date.length - 3)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  );
}

function MyChat({item}) {
  const [date, setDate] = useState();
  useEffect(() => {
    const date = new Date(item.createdAt.seconds * 1000).toLocaleString();
    setDate(date);
  }, []);
  return (
    <View style={styles.MymessageWrapper}>
      <View style={[styles.messageBody, styles.myMessageBody]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      <View style={styles.date}>
        <Text style={styles.dateText}>
          {date && date.slice(6, date.length - 3)}
        </Text>
      </View>
    </View>
  );
}

function StatusMessage({item}) {
  return (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3,
      }}>
      <View
        style={{
          minWidth: '77%',
          alignItems: 'center',
          // backgroundColor: 'lightgray',
          padding: 2,
          borderRadius: 10,
          opacity: 0.7,
        }}>
        <Text
          style={{
            color: 'rgba(234, 255, 239, 0.9)',
            fontSize: 13,
            letterSpacing: -0.5,
          }}>
          {item.nickName} 님이{' '}
          {item.status === 'out'
            ? '나가셨습니다.'
            : item.status === 'in'
            ? '입장하셨습니다.'
            : '퇴장당하셨습니다.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  messageWrapper: {
    flexDirection: 'row',
    width: '60%',
    marginVertical: 10,
  },
  MymessageWrapper: {
    flexDirection: 'row-reverse',
    marginLeft: 'auto',
    marginVertical: 10,
    alignItems: 'flex-end',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 30,
    marginRight: 8,
  },
  textWrapper: {
    flex: 0,
    justifyContent: 'center',
  },
  senderName: {
    paddingBottom: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  messageBody: {
    backgroundColor: '#F1FFF4',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    maxWidth: '83%',
  },
  myMessageBody: {backgroundColor: '#D1DFD5', maxWidth: 300, marginBottom: 0},
  messageText: {
    color: '#3C3D43',
    lineHeight: 21,
    fontSize: 15,
    letterSpacing: -0.5,
  },
  date: {
    justifyContent: 'flex-end',
    marginRight: 7,
    marginLeft: 7,
  },

  dateText: {
    marginBottom: 5,
    fontSize: 11,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
});

export default ChatText;
