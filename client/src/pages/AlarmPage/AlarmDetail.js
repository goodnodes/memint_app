import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import BasicButton from '../../components/common/BasicButton';
import {createMeetingAccept, updateMeetingProposal} from '../../lib/Alarm';
import {
  updateMeeting,
  updateMembersIn,
  updateWaitingOut,
} from '../../lib/Meeting';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import {updateUserMeetingIn} from '../../lib/Users';
import {handleBirth, handleDateInFormat} from '../../utils/common/Functions';
import DoubleModal from '../../components/common/DoubleModal';
import UserInfoModal from '../../components/common/UserInfoModal';
import knowmore from '../../assets/icons/knowmore.png';
import befriend from '../../assets/icons/befriend.png';
import fallinlove from '../../assets/icons/fallinlove.png';
import soso from '../../assets/icons/soso.png';
import notgood from '../../assets/icons/notgood.png';
import terrible from '../../assets/icons/terrible.png';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

function AlarmDetail({route}) {
  const userInfo = useUser();
  const {alarm} = route.params;
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);
  const visibleList = userInfo.visibleUser;

  const [userId, setUserId] = useState('');

  const checkIsVisible = user => {
    // console.log({userInfo})
    // console.log(visibleList)
    if (!visibleList) return false;
    if (visibleList.indexOf(user) !== -1) {
      return true;
    }
    return false;
  };
  const handleAccept = () => {
    const data = {
      sender: userInfo.id, //로그인된 유저,
      receiver: alarm.sender, //(신청 메시지의 sender)
      meetingId: alarm.meetingId,
    };
    createMeetingAccept(data);
    //waiting에서 제거, member에 추가
    updateWaitingOut(alarm.meetingId, alarm.sender); //신청 메시지의 sender
    updateMembersIn(alarm.meetingId, alarm.sender); //신청 메시지의 sender
    // updateMeetingProposal(alarm.id); //신청 알림 완료로 update
    updateUserMeetingIn(
      alarm.sender,
      'joinedroomId',
      alarm.meetingId,
      alarm.senderInfo.nickName,
      'in',
    ); //User에 room 추가하기
    if (
      alarm.meetingInfo.peopleNum * 2 - 1 ===
      alarm.meetingInfo.members.length
    ) {
      //미팅의 상태도 손수 수정해줍니다.(임시로)
      updateMeeting(alarm.meetingId, {status: 'full'});
    }
    showToast('basic', '신청이 수락되었습니다');
    navigation.navigate('AlarmPage');
  };
  // const handleDeny = () => {
  //   showToast('basic', '신청이 거절되었습니다');
  //   navigation.pop();
  // };

  const renderAcceptedStatus = () => {
    if (alarm.meetingInfo.waiting.indexOf(alarm.sender) !== -1) {
      return (
        <>
          <Text style={styles.acceptText}>신청을 수락하시겠습니까?</Text>
          <View style={styles.buttonArea}>
            {/* <BasicButton
                text="거절하기"
                width={120}
                height={50}
                textSize={17}
                margin={[5, 20, 5, 20]}
                backgroundColor="gray"
                onPress={handleDeny}
              /> */}
            <BasicButton
              text="수락하기"
              width={'100%'}
              height={50}
              textSize={17}
              margin={[5, 0, 5, 0]}
              onPress={() => setModalVisible(true)}
            />
          </View>
        </>
      );
    } else if (
      alarm.meetingInfo.members.filter(
        el =>
          el === {[alarm.sender]: 'accepted'} ||
          el === {[alarm.sender]: 'fixed'},
      )
    ) {
      return <Text style={styles.acceptText}>신청을 수락했습니다</Text>;
    } else {
      return <></>;
    }
  };
  const renderEmotion = () => {
    let emotionText = '';
    let image = null;
    if (alarm.emotion === 'knowmore') {
      image = knowmore;
      emotionText = '좀 더 알고싶어요';
    } else if (alarm.emotion === 'befriend') {
      image = befriend;
      emotionText = '친구가 되고싶어요';
    } else if (alarm.emotion === 'fallinlove') {
      image = fallinlove;
      emotionText = '사랑에 빠졌어요';
    } else if (alarm.emotion === 'soso') {
      image = soso;
      emotionText = '그저 그랬어요';
    } else if (alarm.emotion === 'notgood') {
      image = notgood;
      emotionText = '다시는 안 보고 싶어요';
    } else if (alarm.emotion === 'terrible') {
      image = terrible;
      emotionText = '불쾌했어요';
    }

    return (
      <View style={styles.emotionArea}>
        <Image source={image} style={styles.emotionIcon} />
        <Text style={styles.emotionText}>"{emotionText}"</Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <SafeStatusBar />
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 0.3, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.closeRow}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <Icon
              name="close"
              size={24}
              color={'#ffffff'}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.profileArea}>
            <TouchableOpacity
              onPress={() => {
                setUserId(alarm.sender);

                setUserInfoModalVisible(true);
              }}>
              <Image
                source={{uri: alarm.senderInfo.nftProfile}}
                style={styles.userImage}
              />
            </TouchableOpacity>

            <UserInfoModal
              userId={userId}
              userInfoModalVisible={userInfoModalVisible}
              visible={checkIsVisible(alarm.sender)}
              setUserInfoModalVisible={setUserInfoModalVisible}
              pFunction={() => {}}
            />

            <View style={styles.userInfo}>
              <View style={styles.userInfoElement}>
                <Text style={styles.key}>닉네임</Text>
                <Text style={styles.value}>{alarm.senderInfo.nickName}</Text>
              </View>
              <View style={styles.userInfoElement}>
                <Text style={styles.key}>나이</Text>
                <Text style={styles.value}>
                  {handleBirth(alarm.senderInfo.birth)}
                </Text>
              </View>
              <View style={styles.userInfoElement}>
                <Text style={styles.key}>성별</Text>
                <Text style={styles.value}>{alarm.senderInfo.gender}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.key}>
            {alarm.type === 'feedback' ? '후기 내용' : '메시지'}
          </Text>
          {alarm.type === 'feedback' ? renderEmotion() : null}
          <Text style={styles.message}>{alarm.message}</Text>
          <View>
            <Text style={styles.key}>미팅 정보</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChattingListPage');
                setTimeout(() => {
                  navigation.navigate('ChattingRoom', {
                    data: alarm.meetingInfo,
                  });
                }, 800);
              }}>
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
                  {handleDateInFormat(alarm.meetingInfo.meetDate)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/*
        {alarm.meetingInfo.members.filter(
          el =>
            el === {[alarm.sender]: 'accepted'} ||
            el === {[alarm.sender]: 'fixed'},
        ) ? (
          <Text></Text>
        ) : (
          <>
            <Text style={styles.acceptText}>신청을 수락하시겠습니까?</Text>
            <View style={styles.buttonArea}>

              <BasicButton
                text="수락하기"
                width={120}
                height={50}
                textSize={17}
                margin={[5, 20, 5, 20]}
                onPress={() => setModalVisible(true)}
              />
            </View>
          </>
        )} */}
          {alarm.type === 'proposal' ? renderAcceptedStatus() : null}
        </View>
      </LinearGradient>

      <DoubleModal
        text="수락하시겠습니까?"
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pFunction={() => {
          handleAccept();
          setModalVisible(!modalVisible);
        }}
        nFunction={() => {
          setModalVisible(!modalVisible);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'flex-end',
    paddingHorizontal: 15,
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeIcon: {
    paddingVertical: 15,
  },
  container: {
    backgroundColor: 'white',
    paddingVertical: 33,
    paddingHorizontal: 40,
    justifyContent: 'center',
    borderColor: '#58FF7D',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 30,
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  userImage: {
    borderRadius: 100,
    width: 79,
    height: 79,
    borderColor: '#58FF7D',
    borderWidth: 2,
  },
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginBottom: 40,
  },
  acceptText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 30,
    marginBottom: 15,
    letterSpacing: -0.5,
    fontFamily: 'NeoDunggeunmoPro-Regular',
    color: '#000000',
  },
  userInfo: {
    marginLeft: 10,
    width: 190,
  },
  userInfoElement: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    marginLeft: 25,
  },
  meetingInfo: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  meetingElement: {
    fontSize: 13,
    color: '#000000',
    letterSpacing: -0.5,
  },
  bar: {
    width: 1,
    height: 9,
    marginHorizontal: 4,
    backgroundColor: '#000000',
  },
  key: {
    color: '#B9C5D1',
    width: 60,
    fontSize: 15,
    letterSpacing: -0.5,
  },
  value: {
    width: 130,
    justifyContent: 'flex-end',
    fontSize: 15,
    letterSpacing: -0.5,
    color: '#000000',
  },
  message: {
    marginTop: 10,
    marginBottom: 25,
    fontSize: 15,
    letterSpacing: -0.5,
    color: '#000000',
  },
  meetingTitle: {
    marginTop: 10,
    fontSize: 15,
    letterSpacing: -0.5,
    color: '#000000',
  },
  emotionIcon: {
    height: 30,
    width: 30,
    tintColor: 'black',
    marginRight: 10,
  },
  emotionArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  emotionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
});

export default AlarmDetail;
