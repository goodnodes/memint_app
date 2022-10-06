import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import DoubleModal from '../../components/common/DoubleModal';
import DetailMembers from '../../components/meetingComponents/DetailMembers';
import {createMeetingProposal} from '../../lib/Alarm';
import {updateWaitingIn} from '../../lib/Meeting';
import {getUser} from '../../lib/Users';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import {
  handleBirth,
  handleDateInFormat,
  handleISOtoLocale,
} from '../../utils/common/Functions';
import WalletButton from '../../components/common/WalletButton';
import MeetingLikes from '../../components/meetingComponents/MeetingLikes';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import ActivationModal from '../../components/common/ActivationModal';
import firestore from '@react-native-firebase/firestore';
import useAuthActions from '../../utils/hooks/UseAuthActions';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

function MeetingDetail({route}) {
  const {saveInfo} = useAuthActions();
  const userInfo = useUser();
  const loginUser = userInfo.id;
  const {data} = route.params;
  const [modalVisible_2, setModalVisible_2] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const [membersInfo, setMembersInfo] = useState([]);
  const {showToast} = useToast();
  const navigation = useNavigation();
  const [activationModalVisible, setActivationModalVisible] = useState(false);
  const handleRequestMeeting = async () => {
    if (userInfo.isActivated) {
      setModalVisible_2(true);
    } else {
      setActivationModalVisible(true);
    }
  };
  const renderByUser = () => {
    if (
      data.members.reduce((acc, cur) => {
        if (cur[loginUser]) {
          return true || acc;
        } else {
          return acc;
        }
      }, false)
    ) {
      return (
        <BasicButton
          width={'100%'}
          height={50}
          textSize={17}
          backgroundColor={'white'}
          textColor={'black'}
          text="채팅방으로 이동"
          margin={[0, 0, 0, 0]}
          onPress={() => {
            navigation.navigate('ChattingListPage');
            setTimeout(() => {
              navigation.navigate('ChattingRoom', {data: data});
            }, 800);
          }}
        />
      );
    } else if (data.waiting && data.waiting.indexOf(loginUser) !== -1) {
      return (
        <BasicButton
          width={'100%'}
          height={50}
          margin={[0, 0, 0, 0]}
          textSize={17}
          border={false}
          backgroundColor={'lightgray'}
          text="신청 수락 대기 중"
          onPress={() => {}}
        />
      );
    } else {
      return (
        // <GradientButton
        //   width={340}
        //   height={50}
        //   textSize={17}
        //   text="미팅 신청 보내기"
        //   onPress={() => {
        //     setModalVisible_1(true);
        //   }}
        // />
        <BasicButton
          width={'100%'}
          height={50}
          margin={[0, 0, 0, 0]}
          textSize={17}
          text="미팅 신청 보내기"
          // onPress={() => {
          //   setModalVisible_1(true);
          // }}
          onPress={handleRequestMeeting}
        />
      );
    }
  };

  const spendEnergy = async () => {
    await firestore()
      .collection('User')
      .doc(userInfo.id)
      .update({
        ...userInfo,
        meminStats: {
          ...userInfo.meminStats,
          energy: userInfo.meminStats.energy - 15,
        },
      })
      .then(() => {
        saveInfo({
          ...userInfo,
          meminStats: {
            ...userInfo.meminStats,
            energy: userInfo.meminStats.energy - 15,
          },
        });
      });
  };

  const handleCreateProposal = () => {
    if (textMessage.length === 0) {
      setModalVisible_2(!modalVisible_2);
      showToast('error', '메시지를 작성해주세요');
      return;
    }
    try {
      const createData = {
        sender: loginUser, //로그인된 유저
        receiver: data.hostId,
        meetingId: data.id,
        message: textMessage,
      };
      spendEnergy().then(() => {
        createMeetingProposal(createData);
        //meeting waiting 추가
        updateWaitingIn(data.id, loginUser); //로그인된 유저
        setModalVisible_2(!modalVisible_2);
        setTextMessage('');
        showToast(
          'success',
          '미팅 신청을 보냈습니다\n주선자의 수락을 기다려주세요!',
        );
        navigation.navigate('MeetingMarket');
      });
    } catch (e) {
      setModalVisible_2(!modalVisible_2);
      setTextMessage('');
      showToast('error', '미팅 신청에 실패했습니다.\n 다시 시도해주세요');
      console.log(e);
    }
  };

  const getMembersInfo = useCallback(async () => {
    try {
      const memberInfo = await Promise.all(
        data.members.map(async member => {
          const memberId = Object.keys(member)[0];
          const info = await getUser(memberId);
          return {id: memberId, ...info};
        }),
      );
      setMembersInfo(memberInfo);
    } catch (e) {
      console.log(e);
    }
  }, [data]);

  useEffect(() => {
    getMembersInfo();
  }, [getMembersInfo]);
  return (
    <View style={styles.view}>
      {Platform.OS === 'ios' ? (
        <SafeStatusBar />
      ) : (
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor="#3C3D43"
          animated={true}
        />
      )}

      <View style={styles.header}>
        <BackButton />
        <View style={styles.walletView}>
          <WalletButton />
        </View>
      </View>
      <ScrollView
        style={styles.scrollview}
        contentContainerStyle={styles.paddingBottom}>
        <View style={styles.container}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{data.title}</Text>
            <MeetingLikes meetingId={data.id} />
          </View>
          <View style={styles.infoList}>
            <Text style={[styles.infoEl]}>{data.region}</Text>
            <View style={styles.bar} />
            <Text style={[styles.infoEl]}>
              {data.peopleNum + ':' + data.peopleNum}
            </Text>
            <View style={styles.bar} />
            <Text style={[styles.infoEl]}>
              {handleBirth(data.hostInfo.birth)}
            </Text>
            <View style={styles.bar} />
            <Text style={[styles.infoEl]}>
              {handleDateInFormat(data.meetDate)}
            </Text>
          </View>

          <View style={styles.descriptionRow}>
            <Text style={styles.description}>{data.description}</Text>
          </View>
          <View style={styles.meetingTags}>
            {data.meetingTags.map((tag, idx) => {
              return (
                <View style={styles.tag} key={idx}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              );
            })}
          </View>
          <View>
            <DetailMembers
              peopleNum={data.peopleNum}
              membersInfo={membersInfo}
              hostId={data.hostId}
            />
          </View>
          <View style={styles.buttonRow}>{renderByUser()}</View>
        </View>

        {/* <DoubleModal
          text={'미팅을 신청하시겠습니까?\n 15 에너지가 소비됩니다!'}
          nButtonText="아니요"
          pButtonText="신청하기"
          modalVisible={modalVisible_1}
          setModalVisible={setModalVisible_1}
          nFunction={() => setModalVisible_1(!modalVisible_1)}
          pFunction={() => {
            setModalVisible_1(false);
            setModalVisible_2(true);
          }}
        /> */}
        <DoubleModal
          text="주선자에게 보낼 메시지를 작성해주세요"
          body={
            <View style={styles.inputBlock}>
              <TextInput
                placeholder="메시지를 작성하세요"
                multiline={true}
                style={styles.input}
                value={textMessage}
                onChangeText={setTextMessage}
                autoComplete="off"
                autoCorrect={false}
                maxLength={200}
                selectionColor={'#AEFFC1'}
              />
            </View>
          }
          nButtonText="닫기"
          pButtonText="신청 보내기"
          modalVisible={modalVisible_2}
          setModalVisible={setModalVisible_2}
          nFunction={() => setModalVisible_2(!modalVisible_2)}
          pFunction={handleCreateProposal}
        />
        <ActivationModal
          text="Activation Code가 필요합니다."
          //body={<Text>정말로?</Text>}
          buttonText="인증하기"
          modalVisible={activationModalVisible}
          setModalVisible={setActivationModalVisible}
          setNextModalVisible={setModalVisible_2}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#3C3D43',
    flex: 1,
  },
  container: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  hostArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hostInfo: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  hostImageWithCrown: {
    width: 72,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
  },
  hostCrown: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  hostImage: {
    borderRadius: 100,
    width: 50,
    height: 50,
  },
  hostnickName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#ffffff',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    width: 267,
    height: 50,
    lineHeight: 25.2,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: '#EDEEF6',
    lineHeight: 22.4,
    letterSpacing: -0.5,
  },
  meetingTags: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    marginBottom: 42,
  },
  tag: {
    backgroundColor: '#3C3D43',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 99,
    borderColor: '#AEFFC1',
    borderWidth: 1,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  tagText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#AEFFC1',
    letterSpacing: -0.5,
    lineHeight: 22.4,
  },
  descriptionRow: {
    marginTop: 30,
    marginBottom: 12,
  },
  infoRow: {
    marginVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  inputBlock: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    width: 220,
    height: 80,
    marginBottom: 5,
    padding: 5,
  },
  paddingBottom: {
    paddingBottom: 105,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletView: {
    marginRight: 15,
  },
  infoList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoEl: {
    fontSize: 14,
    color: '#B9C5D1',
    letterSpacing: -0.5,
    lineHeight: 19.6,
  },
  bar: {
    width: 1,
    height: 12,
    marginHorizontal: 4,
    marginTop: 1,
    backgroundColor: '#B9C5D1',
  },
});

export default MeetingDetail;
