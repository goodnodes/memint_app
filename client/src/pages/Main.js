import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MeetingCreate from './MeetingPage/MeetingCreate';
import MeetingDetail from './MeetingPage/MeetingDetail';
import MeetingMarket from './MeetingPage/MeetingMarket';
import InviteFriend from './MeetingPage/InviteFriend';
import AlarmPage from './AlarmPage/AlarmPage';
import FeedbackChoicePage from './ChattingPage/FeedbackChoicePage';
import FeedbackSendPage from './ChattingPage/FeedbackSendPage';

import EditMeetingInfo from './ChattingPage/EditMeetingInfo';
import EditMyInfo from './MyPage/EditMyInfo';
import WalletMain from './WalletPage/WalletMain';
import MyPage from './MyPage/MyPage';
import ChattingListPage from './ChattingPage/ChattingListPage';
import ChattingRoom from './ChattingPage/ChattingRoom';
import AlarmDetail from './AlarmPage/AlarmDetail';
import WalletOffchainMain from './WalletPage/WalletOffchainMain';
import WalletOffchainRecieve from './WalletPage/WalletOffchainRecieve';
import WalletOnchainMain from './WalletPage/WalletOnchainMain';
import MyLikesRooms from './MyPage/MyLikesRooms';
import MyMainPage from './MyPage/MyMainPage';
import MySettings from './MyPage/MySettings';
import DeleteUser from './MyPage/DeleteUser';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Main() {
  return (
    <>
      <Tab.Navigator
        initialRouteName="MyMainPage"
        barStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          paddingHorizontal: 8,
          borderRadius: 99,
          borderWidth: 2,
          borderColor: '#33ED96',
          height: 64,
          marginHorizontal: 15,
          marginBottom: 30,
          position: 'absolute',
          zIndex: 10,
        }}
        activeColor="#33ED96"
        inactiveColor="#EDEEF6"
        // style={{backgroundColor: 'rgba(0,0,0,0.0)'}}
      >
        <Tab.Screen
          name="mymainpage"
          component={MyPageScreen}
          options={{
            tabBarLabel: 'MY',
            tabBarIcon: ({color}) => (
              <Icon name="face" color={color} size={24} />
            ),
            tabBarColor: 'transparent',
          }}
        />
        <Tab.Screen
          name="meeting"
          component={MeetingScreen}
          options={{
            tabBarLabel: 'HOME',
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={24} />
            ),
            tabBarColor: 'transparent',
          }}
        />
        <Tab.Screen
          name="ChattingListPage"
          component={ChattingListPage}
          options={{
            tabBarLabel: 'CHATTING',
            tabBarIcon: ({color}) => (
              <Icon name="chat-bubble-outline" color={color} size={24} />
            ),
            tabBarColor: 'transparent',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="alarm"
          component={AlarmScreen}
          options={{
            tabBarLabel: 'ALARM',
            tabBarIcon: ({color}) => (
              <Icon name="notifications-none" color={color} size={24} />
            ),
            tabBarColor: 'transparent',
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const MyPageScreen = () => {
  return (
    <Stack.Navigator initialRouteName="MyMainPage">
      <Stack.Screen
        name="MyMainPage"
        component={MyMainPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyPage"
        component={MyPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyLikesRooms"
        component={MyLikesRooms}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const MeetingScreen = () => {
  return (
    <Stack.Navigator initialRouteName="MeetingMarket">
      <Stack.Screen
        name="MeetingMarket"
        component={MeetingMarket}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MeetingDetail"
        component={MeetingDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MeetingCreate"
        component={MeetingCreate}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InviteFriend"
        component={InviteFriend}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const AlarmScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AlarmPage"
        component={AlarmPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AlarmDetail"
        component={AlarmDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Main;
