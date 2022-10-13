import React, {useState, useRef, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Animated,
  Dimensions,
  Text,
  DeviceEventEmitter,
  Platform,
  StatusBar,
} from 'react-native';
import ChatText from '../../components/chattingComponents/chatText';
import RoomHeader from '../../components/chattingComponents/roomHeader';
import RoomInfo from '../../components/chattingComponents/roomInfo';
import MyDoubleModal from '../../components/chattingComponents/myDoubleModal';
import ChattingRoomTopTab from '../../components/chattingComponents/ChattingRoomTopTab';
import SpendingModal from '../../components/common/UserInfoModal/SpendingModal';
import firestore from '@react-native-firebase/firestore';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {getItem, setItem} from '../../lib/Chatting';
import {set} from 'immer/dist/internal';

const windowWidth = Dimensions.get('window').width;

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

function ChattingRoom({route}) {
  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(1)).current;
  const [roomInfo, setRoomInfo] = useState(false);
  // 처음에 렌더링을 하면 가운데 있던 userinfo 화면이 우측으로 들어가는 것이 보인다.
  // 이를 없애기 위해 우측 상단 햄버거를 클릭하면 그 때 true 값을 주어 컴포넌트 자체가 생성되도록 만들었다.
  // 그런데 이렇게 하면 햄버거를 누를 때마다 setRoomInfoExist에 true 값을 주게 되어 리소스 낭비가 생긴다.
  // 이를 효율적으로 방지할 수 있는 방법은 없을까?

  // roomInfo라는 사이드바 컴포넌트 존재여부
  const [roomInfoExist, setRoomInfoExist] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [proposeModalVisible, setProposeModalVisible] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [meetingEnd, setMeetingEnd] = useState(false);
  const [spendingModalVisible, setSpendingModalVisible] = useState(false);
  const {showToast} = useToast();

  // 추후 추가해야할 data

  const userRef = useMemo(() => firestore().collection('User'), []);
  const [userDetail, setUserDetail] = useState('');
  const ex = useUser();
  const user = useUser().id;

  const memberId = useMemo(() => {
    return [];
  }, []);

  const results = useMemo(() => {
    return [];
  }, []);

  const users = useMemo(
    () =>
      Promise.all(
        route.params.data.members.map(async el => {
          memberId.push(Object.keys(el)[0]);

          const result = await userRef.doc(Object.keys(el)[0]).get();

          results.push(result.data());

          Promise.all(
            memberId.map(async el => {
              return (await userRef.doc(el).get()).data();
            }),
          ).then(result => {
            setUserDetail(
              result.reduce((acc, cur) => {
                return {...acc, [cur.userId]: cur};
              }, 0),
            );
          });
          if (results.length === memberId.length) {
            setUserDetail(
              results.reduce((acc, cur) => {
                return {...acc, [cur.userId]: cur};
              }, 0),
            );
          }
          return;
        }),
      ),
    [],
  );

  useEffect(() => {
    if (
      route.params.data.members.filter(el => {
        return Object.keys(el)[0] === user;
      }).length === 0
    ) {
      navigation.pop();
      return showToast('error', "You don't have access.");
    }
    Animated.spring(animation, {
      toValue: roomInfo ? windowWidth / 5 : windowWidth,
      useNativeDriver: true,
      speed: 13,
      bounciness: 0,
    }).start();

    users;

    // console.log(userDetail);

    setIsHost(route.params.data.hostId === user);

    return () => {
      DeviceEventEmitter.emit(route.params.data.id);
    };
  }, [animation, roomInfo, route.params, userRef, users, user, ex]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ios: 'padding'})}
      style={{flex: 1, backgroundColor: 'white'}}
      // 키보드가 올라온 상태에서 추가적으로 적용할 +값
      // keyboardVerticalOffset={80}
    >
      {Platform.OS === 'ios' ? (
        <SafeStatusBar />
      ) : (
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor="#3D3E44"
          animated={true}
        />
      )}

      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 1, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View>
          <RoomHeader
            roomInfo={roomInfo}
            setRoomInfo={setRoomInfo}
            setRoomInfoExist={setRoomInfoExist}
          />
        </View>
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <ChattingRoomTopTab
            isConfirmed={isConfirmed}
            meetingEnd={meetingEnd}
            setProposeModalVisible={setProposeModalVisible}
            setModalVisible={setModalVisible}
            data={route.params.data}
          />

          <ChatText
            data={route.params.data}
            roomInfo={roomInfo}
            setRoomInfo={setRoomInfo}
            userDetail={userDetail}
          />

          {roomInfoExist ? (
            <Animated.View
              style={[styles.roomInfo, {transform: [{translateX: animation}]}]}>
              <RoomInfo
                chatInfo={route.params.data}
                setModalVisible={setModalVisible}
                setMeetingEnd={setMeetingEnd}
                userDetail={userDetail}
              />
            </Animated.View>
          ) : null}

          <MyDoubleModal
            body={
              <>
                <Text
                  style={{
                    marginTop: 7,
                    fontSize: 17,
                    fontWeight: '500',
                    letterSpacing: -0.5,
                    color: '#000000',
                    textAlign: 'center',
                  }}>
                  Are you sure you want to confirm your participation in this
                  group dating?
                </Text>
                <View style={{alignItems: 'flex-start'}}>
                  {/* 리덕스에서 받아오는 meeting 정보로 업데이트할 것  */}
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 16,
                      letterSpacing: -0.5,
                      color: '#000000',
                    }}>
                    🗓 Date:{'    '}
                    {route.params.data.meetDate
                      .toDate()
                      .toLocaleString()
                      .slice(0, -10)}
                  </Text>
                  <Text
                    style={{
                      marginTop: 7,
                      fontSize: 16,
                      letterSpacing: -0.5,
                      color: '#000000',
                    }}>
                    ⏰ Time:{'   '}
                    {route.params.data.meetDate
                      .toDate()
                      .toLocaleString('en')
                      .slice(-11, -6) +
                      ' ' +
                      route.params.data.meetDate
                        .toDate()
                        .toLocaleString('en')
                        .slice(-2)}
                  </Text>
                  <Text
                    style={{
                      marginTop: 7,
                      fontSize: 16,
                      letterSpacing: -0.5,
                      marginBottom: 20,
                      color: '#000000',
                    }}>
                    🏖 Place:{'   '}
                    {route.params.data.region}
                  </Text>
                </View>
              </>
            }
            nButtonText="No"
            pButtonText="Yes"
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setIsConfirmed={setIsConfirmed}
            meetingStatus={route.params.data.status}
            isHost={isHost}
            id={route.params.data.id}
          />
          {/* <SpendingModal
          spendingModalVisible={spendingModalVisible}
          setSpendingModalVisible={setSpendingModalVisible}
          txType="미팅 확정"
          amount={1}
          pFunction={() => {
            changeMeetingState(route.params.data.id);
            setSpendingModalVisible(false);

            showToast('basic', '미팅이 확정되었습니다.');
          }}
        /> */}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  roomInfo: {
    backgroundColor: '#3C3D43',
    position: 'absolute',
    width: (windowWidth / 5) * 4,
    height: '100%',
  },
});

export default ChattingRoom;
