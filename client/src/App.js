import React, {useEffect, useState} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {navigate, navigationRef} from './RootNavigation';
import {Provider} from 'react-redux';
// import {createStore} from 'redux';
// import {configureStore} from 'redux';
import {legacy_createStore as createStore} from 'redux';
import rootReducer from './slices/Index';
import Main from './pages/Main';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ToastProvider} from './context/ToastContext';
import Toast from './components/common/Toast';
import ChattingRoom from './pages/ChattingPage/ChattingRoom';
import {ChatContextProvider} from './components/chattingComponents/context/chatContext';
import SignInScreen from './pages/AuthPage/SignInScreen';
import SignUpScreen from './pages/AuthPage/SignUpScreen';
import VerifyMobileScreen from './pages/AuthPage/VerifyMobileScreen';
import SignUpUserInfoScreen from './pages/AuthPage/SignUpUserInfoScreen';
import SignUpUserDetailScreen from './pages/AuthPage/SignUpUserDetailScreen';
import SplashScreen from 'react-native-splash-screen';
import SignUpServeNFTScreen from './pages/AuthPage/SignUpServeNFTScreen';
import SignUpAgreementScreen from './pages/AuthPage/SignUpAgreement';
import SignUpAlarmScreen from './pages/AuthPage/SignUpAlarmScreen';
import FindIdVerifyMobileScreen from './pages/AuthPage/FindIdVerifyMobileScreen';
import FindIdShowIdScreen from './pages/AuthPage/FindIdShowIdScreen';
import FindPWVerifyScreen from './pages/AuthPage/FindPWVerifyScreen';
import SetNewPWScreen from './pages/AuthPage/SetNewPWScreen';
import WalletOffchainScreen from './pages/WalletPage/WalletOffchainScreen';
import EventPage from './pages/ChattingPage/EventPage';
import useAuth from './utils/hooks/UseAuth';
import useAuthActions from './utils/hooks/UseAuthActions';
import {subscribeAuth} from './lib/Auth';
import {getUser, getUserProperty, saveTokenToDatabase} from './lib/Users';
import useNftActions from './utils/hooks/UseNftActions';
import {getNFTs, getProfile, getMemin, calcHumanElement} from './lib/NFT';
import {getMeeting} from './lib/Meeting';
import useMeetingActions from './utils/hooks/UseMeetingActions';
import useUser from './utils/hooks/UseUser';
import {getOnchainKlayLog} from './lib/OnchainKlayLog';
import {getOnchainTokenLog} from './lib/OnchainTokenLog';
import useOnchainActions from './utils/hooks/UseOnchainActions';
import FeedbackChoicePage from './pages/ChattingPage/FeedbackChoicePage';
import FeedbackSendPage from './pages/ChattingPage/FeedbackSendPage';
import MeetingSet from './pages/ChattingPage/MeetingSet';
import EditMeetingInfo from './pages/ChattingPage/EditMeetingInfo';
import MeetingMemberOut from './pages/ChattingPage/MeetingMemberOut';
import Report from './pages/ChattingPage/Report';
import MeetingConfirm from './pages/ChattingPage/MeetingConfirm';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {useToast} from './utils/hooks/useToast';
import MySettings from './pages/MyPage/MySettings';
import DeleteUser from './pages/MyPage/DeleteUser';
import EditMyInfo from './pages/MyPage/EditMyInfo';
import ChangePw from './pages/MyPage/ChangePw';
import ReverifyForDelete from './pages/MyPage/ReverifyForDelete';

const Stack = createNativeStackNavigator();
const store = createStore(rootReducer);

function App() {
  const userInfo = useAuth();
  const userState = useUser();
  const {authorize, logout, saveInfo} = useAuthActions();
  const {saveNFT, setMemin} = useNftActions();
  const {saveMeeting} = useMeetingActions();
  const [initialRouteName, setInitialRouteName] = useState('SignIn');
  const [alarm, setAlarm] = useState('');
  const {addKlayLog, addLcnLog} = useOnchainActions();
  const saveUserInfo = async user => {
    try {
      let userDetail = await getUser(user.uid);
      let userProperty = await getUserProperty(user.uid);
      getOnchainKlayLog(user.uid).then(res => {
        const logs = res.docs.map(el => {
          return {...el.data()};
        });
        addKlayLog(logs);
      });
      getOnchainTokenLog(user.uid).then(res => {
        const logs = res.docs.map(el => {
          return {...el.data()};
        });
        addLcnLog(logs);
      });
      // add code to remove undefined TypeError in SignUp Page
      userDetail = userDetail === undefined ? {nftProfile: ''} : userDetail;
      userProperty =
        userProperty.length === 0
          ? [
              {
                alcoholQuantity: [],
                alcoholType: [],
                alcoholStype: [],
                nftImage: '',
                profileImage: '',
              },
            ]
          : userProperty;

      const res = await getNFTs(user.uid);
      const nfts = res.docs.map(el => {
        return {...el.data()};
      });
      saveNFT(nfts);

      setMemin(...getMemin(nfts));

      saveInfo({
        ...userState,
        id: user.uid,
        email: user.email,
        nickName: userDetail.nickName,
        gender: userDetail.gender,
        birth: userDetail.birth,
        nftIds: userDetail.nftIds,
        picture: userDetail.picture,
        address: userDetail.address,
        // privateKey: userDetail.privateKey,
        phoneNumber: userDetail.phoneNumber,
        tokenAmount: userDetail.tokenAmount,
        klayAmount: userDetail.klayAmount,
        onChainTokenAmount: userDetail.onChainTokenAmount,
        // createdroomId: userDetail.createdroomId,
        // joinedroomId: userDetail.joinedroomId,
        nftProfile: userDetail.nftProfile,
        property: userDetail.property,
        visibleUser: userDetail.visibleUser,
        likesroomId: userDetail.likesroomId,
        marketingAgreement: userDetail.marketingAgreement,
        isActivated: userDetail.isActivated,
        selfIntroduction: userDetail.selfIntroduction,
        isReadyToGetFreeToken: userDetail.isReadyToGetFreeToken,
        meminStats: {
          HumanElement: calcHumanElement(
            userDetail.meminStats.grade,
            userDetail.meminStats.level,
          ),
          energyRechargeTime: userDetail.meminStats.energyRechargeTime,
          receivedFeedbackCount: userDetail.meminStats.receivedFeedbackCount,
          dino: userDetail.meminStats.dino,
          energy: userDetail.meminStats.energy,
          resilience: userDetail.meminStats.resilience,
          charm: userDetail.meminStats.charm,
          exp: userDetail.meminStats.exp,
          grade: userDetail.meminStats.grade,
          level: userDetail.meminStats.level,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    try {
      console.log('rendering splash');
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
      checkApplicationPermission();
    } catch (e) {
      console.warn('Error occured');
      console.warn(e);
    }
  }, []);

  async function checkApplicationPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log(' permissions enabled.');
      return true;
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
      return true;
    } else {
      console.log('User has notification permissions disabled');
      return false;
    }
  }

  async function registerAppWithFCM() {
    try {
      await messaging().registerDeviceForRemoteMessages();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const unsubscribe = subscribeAuth(user => {
      const userProvider = user
        ? user.additionalUserInfo
          ? user.additionalUserInfo.providerId
          : user.providerId
        : null;
      if (user && user.email !== null) {
        authorize({
          id: user.uid,
          email: user.email,
        });
        //push notification
        //get the device token
        registerAppWithFCM().then(() => {
          messaging()
            .getToken()
            .then(token => {
              return saveTokenToDatabase(token, user.uid);
            });

          //listen to whether the token changes
          messaging().onTokenRefresh(token => {
            saveTokenToDatabase(token, user.uid);
          });
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
          if (remoteMessage.notification.title === 'MEMINT') {
            navigate('alarm');
          } else {
            navigate('ChattingListPage');
          }
        });

        saveUserInfo(user);
        setInitialRouteName('Main');
      } else {
        logout();
        setInitialRouteName('SignIn');
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    console.log('@@UseEffect Re-rendering@@@@');
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //displaying push notification in foreground
  const handleNotification = async message => {
    const channelAnoucement = await notifee.createChannel({
      id: 'default',
      name: 'memint',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId: channelAnoucement,
        smallIcon: 'ic_launcher',
      },
    });
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (
        navigationRef.current?.getCurrentRoute().name === 'ChattingRoom' ||
        navigationRef.current?.getCurrentRoute().name === 'ChattingListPage'
      ) {
        if (remoteMessage.notification.title !== 'MEMINT') {
          return;
        } else {
          handleNotification(remoteMessage);
        }
      } else {
        handleNotification(remoteMessage);
      }
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return null;
  }
  console.log('@@Re-rendering@@@@');
  // if (!user) {
  //   console.log('Login Necessary');
  // } else {
  //   console.log('welcome' + user.email);
  // }
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <ToastProvider>
          <ChatContextProvider>
            <Stack.Navigator initialRouteName={initialRouteName}>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="VerifyMobile"
                component={VerifyMobileScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpUserInfo"
                component={SignUpUserInfoScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpUserDetail"
                component={SignUpUserDetailScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpServeNFT"
                component={SignUpServeNFTScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpAgreement"
                component={SignUpAgreementScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpAlarm"
                component={SignUpAlarmScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FindIdVerifyMobile"
                component={FindIdVerifyMobileScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FindIdShowId"
                component={FindIdShowIdScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FindPWVerify"
                component={FindPWVerifyScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SetNewPW"
                component={SetNewPWScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Main"
                component={Main}
                options={{headerShown: false}}
                initialParams={{alarm}}
              />

              <Stack.Screen
                name="Wallet"
                component={WalletOffchainScreen}
                options={{title: null, headerShown: false}}
              />
              <Stack.Screen
                name="ChattingRoom"
                component={ChattingRoom}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FeedbackChoicePage"
                component={FeedbackChoicePage}
                options={{headerShown: false}}
                // options={{animation: 'none'}}
              />
              <Stack.Screen
                name="MeetingSet"
                component={MeetingSet}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="FeedbackSendPage"
                component={FeedbackSendPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MeetingMemberOut"
                component={MeetingMemberOut}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="EditMeetingInfo"
                component={EditMeetingInfo}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Report"
                component={Report}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MeetingConfirm"
                component={MeetingConfirm}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="EventPage"
                component={EventPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="MySettings"
                component={MySettings}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="DeleteUser"
                component={DeleteUser}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="EditMyInfo"
                component={EditMyInfo}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ChangePw"
                component={ChangePw}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="ReverifyForDelete"
                component={ReverifyForDelete}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
            <Toast />
          </ChatContextProvider>
        </ToastProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
