import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import useUser from '../../utils/hooks/UseUser';
import EarnModal from '../../components/common/UserInfoModal/EarnModal';
import {useToast} from '../../utils/hooks/useToast';
import RoomHeader from '../../components/chattingComponents/roomHeader';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import {setFeedbackEnd} from '../../lib/Meeting';
import DoubleModal from '../../components/common/DoubleModal';
import LinearGradient from 'react-native-linear-gradient';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import BackButton from '../../components/common/BackButton';

function FeedbackChoicePage({route}) {
  const isFocused = useIsFocused();

  const owner = useUser();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [earnModalVisible, setEarnModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const {showToast} = useToast();
  const [other, setOther] = useState('');
  const [confirmable, setConfirmable] = useState(true);
  const {data, userInfo} = route.params;

  useEffect(() => {
    setConfirmable(true);
    firestore()
      .collection('User')
      .doc(owner.id)
      .collection('Feedback')
      .doc(data.id)
      .get()
      .then(result => {
        const other = userInfo
          .filter(el => {
            return el[2] !== owner.id;
          })
          .map(el => {
            return [...el, result.data()[el[2]]];
          });

        if (
          other.filter(el => {
            return el[4] === true;
          }).length === 0
        ) {
          setConfirmable(false);
        }

        setOther(
          other.map((el, idx) => {
            return (
              <Human
                person={el}
                key={idx}
                meetingId={data.id}
                data={data}
                userInfo={userInfo}
              />
            );
          }),
        );
      });
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      <SafeStatusBar />
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 1, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.header}>
          <BackButton />
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>Feedback</Text>

          <View style={styles.wrapper}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginBottom: 20,
                color: '#ffffff',
                letterSpacing: -0.5,
              }}>
              Hey {owner.nickName},{'\n'}
              How was your group dating with{' '}
              {userInfo.length === 2
                ? `${
                    userInfo.filter(el => {
                      return el[2] !== owner.id;
                    })[0][0]
                  }`
                : `${
                    userInfo.filter(el => {
                      return el[2] !== owner.id;
                    })[0][0]
                  }, and other ${userInfo.length - 2} members?`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 50,
                color: '#ffffff',
                letterSpacing: -0.5,
              }}>
              Please write at least one feedback.
            </Text>
            {/* <View>
              <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 7}}>
                후기를 남길 미팅 상대를 선택하세요.
              </Text>
              <Text style={{fontWeight: '200'}}>
                최소 한 명 이상 후기를 작성해주세요.
              </Text>
            </View> */}
            <View
              style={{
                flex: 1,
              }}>
              {other && other}
              <Pressable
                style={styles.confirmButton}
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Text
                  style={{color: '#1D1E1E', fontSize: 18, fontWeight: '600'}}>
                  Done
                </Text>
              </Pressable>
            </View>
            <DoubleModal
              text="Do you want to complete sending feedbacks?"
              nButtonText="No"
              pButtonText="Yes"
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              pFunction={() => {
                if (confirmable) {
                  setFeedbackEnd(data.id, owner.id).then(() => {
                    setModalVisible(false);
                    setEarnModalVisible(true);
                    // 토큰 보상 로직 추가
                  });
                } else {
                  setModalVisible(!modalVisible);
                  showToast('error', 'Please write at least one feedback.');
                }
              }}
              nFunction={() => {
                setModalVisible(!modalVisible);
              }}
            />
            <EarnModal
              EarnModalVisible={earnModalVisible}
              setEarnModalVisible={setEarnModalVisible}
              pFunction={() => {
                setEarnModalVisible(false);
                navigation.pop();
                showToast('success', 'Completing sending feedbacks.');
              }}
              amount={owner.meminStats.HumanElement / 10} // 나중에 근면함 점수 곱해서 넣어줘야함
              txType="Send Feedbacks"
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function Human({person, meetingId, data, userInfo}) {
  const navigation = useNavigation();
  const {showToast} = useToast();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 18,
      }}>
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <Image
          source={{uri: person[1]}}
          style={[
            {width: 30, height: 30, borderRadius: 999},
            data.hostId === person[2]
              ? {borderWidth: 1, borderColor: '#58FF7D'}
              : null,
          ]}
        />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 5,
            color: '#ffffff',
            letterSpacing: -0.5,
            lineHeight: 25.2,
            fontWeight: '500',
          }}>
          {person[0]}
        </Text>
      </View>
      <TouchableOpacity
        style={
          person[4]
            ? [styles.button, {backgroundColor: '#1D1E1E'}] //여기가 완료
            : styles.button
        }
        onPress={() => {
          person[4]
            ? showToast('error', "You've already sent your feedback")
            : navigation.navigate('FeedbackSendPage', {
                person,
                data,
                userInfo,
              });
        }}>
        <Text
          style={
            person[4]
              ? {
                  color: '#58FF7D',
                  fontSize: 15,
                  fontWeight: '500',
                  letterSpacing: -0.5,
                }
              : {
                  color: '#C7D8CC',
                  fontSize: 15,
                  fontWeight: '500',
                  letterSpacing: -0.5,
                }
          }>
          {person[4] ? 'Done' : 'Send a feedback'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  wrapper: {
    flex: 1,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginVertical: 20,
    letterSpacing: -0.5,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
  },

  button: {
    height: 30,
    width: 120,
    backgroundColor: '#1D1E1E',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },
  header: {
    height: 50,
    justifyContent: 'center',
  },
});

export default FeedbackChoicePage;
