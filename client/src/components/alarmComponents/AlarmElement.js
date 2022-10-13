import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import {
//   GestureHandlerRootView,
//   RectButton,
//   Swipeable,
// } from 'react-native-gesture-handler';
// import Animated, {set} from 'react-native-reanimated';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import {deleteAlarm} from '../../lib/Alarm';
import {changeJoinerToTokenReceived} from '../../lib/Meeting';
import {updateMeminStats} from '../../lib/Users';
import {
  handleBirth,
  handleDate,
  handleDateFromNow,
  handleDateInFormat,
} from '../../utils/common/Functions';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import DoubleModal from '../common/DoubleModal';
import EarnModal from '../common/UserInfoModal/EarnModal';

function AlarmElement({alarm, getAlarmPage, alarms, setAlarms}) {
  const user = useUser();
  const {saveInfo} = useAuthActions();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [chattingConfirmModal, setChattingConfirmModal] = useState(false);
  const [earnAskingModal, setEarnAskingModal] = useState(false);
  const [earnModalVisible, setEarnModalVisible] = useState(false);

  const handleClick = () => {
    if (!alarm.meetingInfo || alarm.type === 'banned') {
      return;
    } else if (alarm.type === 'proposal' || alarm.type === 'feedback') {
      navigation.navigate('AlarmDetail', {
        alarm,
      });
    } else if (alarm.type === 'earned') {
      //받았는지, 안받았는지 확인..
      if (
        alarm.meetingInfo.members.filter(el => {
          return Object.keys(el)[0] === user.id;
        })[0][user.id] === 'tokenReceived'
      ) {
        showToast('error', "You've already been rewarded.");
        return;
      }
      setEarnAskingModal(true);
    } else {
      setChattingConfirmModal(!chattingConfirmModal);
    }
  };

  const renderByType = () => {
    if (alarm.type === 'banned') {
      return 'You were kicked out of the group dating room."';
    } else if (alarm.type === 'feedback') {
      return `${alarm.senderInfo?.nickName} sent a feedback`;
    } else if (alarm.type === 'accept') {
      return `${alarm.senderInfo?.nickName} accepted your request`;
    } else if (alarm.type === 'proposal') {
      return `${alarm.senderInfo?.nickName}'s request has arrived`;
    } else if (alarm.type === 'earned') {
      return 'Verification succeeded. Get your rewards!';
    } else {
      return '';
    }
  };

  const handleTokenReceive = async () => {
    setEarnModalVisible(false);
    const meminStats = user.meminStats;
    //firestore user 변경 , saveInfo
    if (meminStats.exp === 5) {
      saveInfo({
        ...user,
        meminStats: {
          ...user.meminStats,
          exp: 0,
          level: meminStats.level + 1,
        },
      });
      await updateMeminStats(user.id, {
        ...meminStats,
        exp: 0,
        level: meminStats.level + 1,
      });
    } else {
      saveInfo({
        ...user,
        meminStats: {...user.meminStats, exp: meminStats.exp + 1},
      });
      await updateMeminStats(user.id, {...meminStats, exp: meminStats.exp + 1});
    }
    //firebase meeting members 변경
    await changeJoinerToTokenReceived(alarm.meetingInfo.id, user.id);
    showToast('success', 'Rewarded for participating in the group dating.');
    await getAlarmPage();
  };

  // const handleDelete = async () => {
  //   await deleteAlarm(user.id, alarm.id);
  //   setAlarms([]);
  //   setAlarms(alarms.filter(el => el.id !== alarm.id));
  // };

  // const renderRightActions = (progress, dragX) => {
  //   // const trans = dragX.interpolate({
  //   //   inputRange: [0, 50, 100, 101],
  //   //   outputRange: [-20, 0, 0, 1],
  //   // });
  //   return (
  //     <RectButton
  //       style={{
  //         // flex: 1,
  //         width: 80,
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //       }}
  //       onPress={handleDelete}>
  //       {/* <Animated.Text
  //         style={[
  //           {
  //             color: 'black',
  //             fontSize: 16,
  //             transform: [{translateX: trans}],
  //           },
  //         ]}>
  //         Swiped!!
  //       </Animated.Text> */}
  //       <Icon
  //         name={'delete-outline'}
  //         size={30}
  //         color={'rgba(241, 255, 245, 0.9)'}
  //       />
  //       {/* <Text>삭제</Text> */}
  //     </RectButton>
  //   );
  // };

  return (
    // <GestureHandlerRootView>
    // <Swipeable renderRightActions={renderRightActions}>
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <DoubleModal
        text="Do you want to go to the chatting room?"
        //body={<Text>정말로?</Text>}
        nButtonText="No"
        pButtonText="Yes"
        modalVisible={chattingConfirmModal}
        setModalVisible={setChattingConfirmModal}
        pFunction={() => {
          setChattingConfirmModal(!chattingConfirmModal);
          navigation.navigate('ChattingListPage');
          setTimeout(() => {
            navigation.navigate('ChattingRoom', {data: alarm.meetingInfo});
          }, 800);
          // navigation.navigate('ChattingRoom', {data: alarm.meetingInfo});
        }}
        nFunction={() => {
          setChattingConfirmModal(!chattingConfirmModal);
        }}
      />
      <DoubleModal
        text="Would you like to receive a reward for participating the group dating?"
        //body={<Text>정말로?</Text>}
        nButtonText="No"
        pButtonText="Yes"
        modalVisible={earnAskingModal}
        setModalVisible={setEarnAskingModal}
        pFunction={() => {
          setEarnAskingModal(!earnAskingModal);
          setEarnModalVisible(true);
        }}
        nFunction={() => {
          setEarnAskingModal(!earnAskingModal);
        }}
      />
      <EarnModal
        EarnModalVisible={earnModalVisible}
        setEarnModalVisible={setEarnModalVisible}
        pFunction={handleTokenReceive}
        amount={user.meminStats.HumanElement / 10} // 나중에 근면함 점수 곱해서 넣어줘야함
        txType="Participate Group Dating"
      />
      <View style={styles.content}>
        <View style={styles.messageHead}>
          <Text style={styles.message}>{renderByType()}</Text>
          <Text style={styles.createdAt}>
            {handleDateFromNow(alarm.createdAt)}
          </Text>
        </View>
        <View style={styles.meetingArea}>
          {alarm.meetingInfo ? (
            <>
              <Text style={styles.meetingTitle}>{alarm.meetingInfo.title}</Text>
              <View style={styles.meetingInfo}>
                <Text style={styles.meetingElement}>
                  {alarm.meetingInfo.region}
                </Text>
                <View style={styles.bar} />
                <Text style={styles.meetingElement}>
                  {alarm.meetingInfo.peopleNum +
                    ':' +
                    alarm.meetingInfo.peopleNum}
                </Text>
                <View style={styles.bar} />
                <Text style={styles.meetingElement}>
                  {handleBirth(alarm.meetingInfo.hostInfo.birth)}
                </Text>
                <View style={styles.bar} />
                <Text style={styles.meetingElement}>
                  {handleDate(alarm.meetingInfo.meetDate)}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.deleteText}>Deleted group dating room..</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
    // </Swipeable>
    // </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(241, 255, 245, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 108,
    borderRadius: 12,
    marginVertical: 6,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,

    // elevation: 4,
  },
  icon: {
    marginRight: 13,
  },
  content: {
    flex: 1,
  },
  messageHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: '#000000',
    lineHeight: 21,
  },
  createdAt: {
    fontSize: 11,
    color: '#000000',
    letterSpacing: -0.5,
    lineHeight: 16.8,
  },
  meetingArea: {
    height: 40,
  },
  meetingInfo: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 2,
  },
  bar: {
    width: 1,
    height: 9,
    marginHorizontal: 4,
    backgroundColor: '#3C3D43',
    marginTop: 6,
  },
  meetingElement: {
    fontSize: 12,
    color: '#3C3D43',
    letterSpacing: -0.5,
    fontWeight: '500',
    lineHeight: 18.2,
  },
  meetingTitle: {
    fontWeight: '500',
    color: '#3C3D43',
    letterSpacing: -0.5,
    lineHeight: 18.2,
    fontSize: 12,
    marginBottom: 4,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3C3D43',
    letterSpacing: -0.5,
    lineHeight: 18.2,
  },
});

export default AlarmElement;
