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
        start={{x: 0.3, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <BackButton />

        <View style={styles.container}>
          <Text style={styles.title}>미팅참여 인증하기</Text>

          <View style={styles.wrapper}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginBottom: 20,
                color: '#ffffff',
                letterSpacing: -0.5,
              }}>
              {owner.nickName}님,{'\n'}
              {userInfo.length === 2
                ? `${
                    userInfo.filter(el => {
                      return el[2] !== owner.id;
                    })[0][0]
                  } 님과의 미팅은 어땠어요?`
                : `${
                    userInfo.filter(el => {
                      return el[2] !== owner.id;
                    })[0][0]
                  }님 외 ${userInfo.length - 2}명과의 미팅은 어땠어요?`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 50,
                color: '#ffffff',
                letterSpacing: -0.5,
              }}>
              최소 한명 이상의 후기를 작성해주세요
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
                  완료
                </Text>
              </Pressable>
            </View>
            <DoubleModal
              text="후기 작성을 완료하시겠습니까?"
              nButtonText="아니요"
              pButtonText="네"
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              pFunction={() => {
                confirmable
                  ? setFeedbackEnd(data.id, owner.id).then(() => {
                      showToast('success', '후기 보내기를 완료하였습니다.');
                      navigation.pop();
                      // 토큰 보상 로직 추가
                    })
                  : setModalVisible(!modalVisible);
                showToast('error', '한 명 이상의 후기를 작성해주세요.');
              }}
              nFunction={() => {
                setModalVisible(!modalVisible);
              }}
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
      }}>
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <Image
          source={{uri: person[1]}}
          style={{width: 30, height: 30, borderRadius: 999}}
        />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 5,
            color: '#ffffff',
            letterSpacing: -0.5,
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
            ? showToast('error', '이미 후기를 보내셨습니다.')
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
          {person[4] ? '후기 작성 완료' : '후기 작성하기'}
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
    marginVertical: 30,
    letterSpacing: -0.5,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
  },

  button: {
    height: 30,
    width: 103,
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
});

export default FeedbackChoicePage;
