import React, {useRef, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import {reauthenticate} from '../../lib/Auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {useToast} from '../../utils/hooks/useToast';
import {deleteUserAuth, signIn} from '../../lib/Auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {deleteUserDB, deletePhoneNumber} from '../../lib/Users';
import DoubleModal from '../../components/common/DoubleModal';
const ReverifyForDelete = ({navigation, route}) => {
  let userInfo = route.params.user;
  //   useEffect(() => {
  //     console.log(userInfo);
  //   });
  const {showToast} = useToast();
  const [buttonReady, setButtonReady] = useState(false);
  const [pwButtonReady, setPwButtonReady] = useState(false);
  const [validNumber, setValidNumber] = useState(
    '11자리 숫자 전화번호를 입력해주세요',
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [textColor, setTextColor] = useState('gray');
  const [verified, setVerified] = useState(null);
  const [verifyTextColor, setVerifyTextColor] = useState('gray');
  const [confirmNo, setConfirmNo] = useState(null);
  const [confirmTextColor, setConfirmTextColor] = useState('gray');
  const [confirm, setConfirm] = useState(null);
  const {top} = useSafeAreaInsets();

  const [form, setForm] = useState({
    password: '',
    mobileNumber: '',
    code: '',
  });

  // const {isSignup} = route.params || {};
  const passwordRef = useRef();

  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
    if (name === 'mobileNumber') {
      if (value.length === 0) {
        setValidNumber('전화번호를 입력해주세요 (11자리 숫자)');
        setTextColor('#EAFFEF');
      } else if (value !== userInfo.phoneNumber) {
        setButtonReady(false);
        setValidNumber('전화번호가 유효하지 않습니다');
        setTextColor('#FF5029');
      } else if (value === userInfo.phoneNumber) {
        setButtonReady(true);
        setValidNumber('유효한 전화번호 입니다.');
        setTextColor('#58FF7D');
      }
    } else if (name === 'password') {
      if (value.length === 0) {
        setPwButtonReady(false);
      } else if (value.length > 0) {
        setPwButtonReady(true);
      }
    }
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
  };

  const onCheckPw = async () => {
    const reauthentication = await reauthenticate(form.password);
    if (reauthentication) {
      setVerified(true);
      setVerifyTextColor('#58FF7D');
    } else {
      setVerified(false);
      setVerifyTextColor('#FF5029');
    }
  };

  async function verifyPhoneNumber(phoneNumber) {
    if (verified) {
      try {
        setValidNumber('인증번호가 발송되었습니다');
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
      } catch (e) {
        const messages = {
          'auth/too-many-requests': `인증 번호 요청을 너무 많이했습니다. ${'\n'} 잠시 후 다시 시도해주세요.`,
        };
        const msg = messages[e.code];
        Alert.alert('실패', msg);
        console.log(e);
      }
    } else {
      showToast('error', '비밀번호를 먼저 인증해주세요.');
    }
  }

  // Handle confirm code button press
  async function confirmCode() {
    try {
      await confirm.confirm(form.code).then(console.log);
      setConfirmNo(true);
      setConfirmTextColor('#58FF7D');
      //   auth().signOut();
    } catch (error) {
      console.log(error);
      console.log('Invalid code.');
      setConfirmNo(false);
      setConfirmTextColor('#FF5029');
    }
  }

  const handleFinalDelete = async () => {
    setModalVisible(!modalVisible);
    if (verified && confirmNo) {
      try {
        // 엄청난 혼란 방지를 위해 DB는 삭제 안 함.
        // deleteUserDB(userInfo.id);
        deleteUserAuth(); // 휴대폰 Auth 삭제
      } catch (e) {
        console.log(e);
      } finally {
        // 또 가입 기회를 주기 위해 휴대폰번호는 초기화
        deletePhoneNumber(userInfo.id);
        await signIn({email: userInfo.email, password: form.password});
        deleteUserAuth(); // 이메일, 비밀번호 Auth 삭제
        navigation.navigate('SignIn');
      }
    } else {
      showToast('error', '비밀번호와 휴대폰 번호를 인증해주세요.');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}> */}
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior="padding">
        <StatusBar barStyle="dark-content" />
        <View style={{backgroundColor: '#ABDCC1', height: top}} />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.pop()}>
          <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
          {/* <Text style={styles.buttonText}>Back</Text> */}
        </TouchableOpacity>
        <View style={styles.fullscreen}>
          <Text style={styles.title}>본인 인증</Text>
          <Text style={styles.contentText}>
            안전한 탈퇴를 위해 비밀번호와 휴대폰 번호를 인증해주세요.
          </Text>

          <ScrollView style={styles.fullscreenSub}>
            <View style={styles.form}>
              <Text style={styles.contentText}>비밀번호</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="비밀번호를 입력해주세요"
                    value={form.password}
                    onChangeText={createChangeTextHandler('password')}
                    autoCapitalize="none"
                    returnKeyType={'done'}
                    secureTextEntry
                    autoCorrect={false}
                  />
                </View>

                <BasicButton
                  style={styles.button}
                  textColor={pwButtonReady ? '#1D1E1E' : '#ffffff'}
                  width={104}
                  height={42}
                  textSize={13}
                  margin={[0, 0, 0, 8]}
                  disabled={!pwButtonReady}
                  border={true}
                  backgroundColor={pwButtonReady ? '#AEFFC1' : 'transparent'}
                  text="인증하기"
                  hasMarginBottom
                  onPress={() => {
                    onCheckPw();
                  }}
                />
              </View>
              <Text
                style={[
                  styles.invalidNumber,
                  {color: verifyTextColor, marginBottom: 10},
                ]}>
                {verified === null
                  ? ''
                  : verified
                  ? '확인되었습니다.'
                  : '비밀번호가 유효하지 않습니다.'}
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.contentText}>휴대폰</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="전화번호를 입력해주세요"
                    value={form.mobileNumber}
                    onChangeText={createChangeTextHandler('mobileNumber')}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    autoCorrect={false}
                    // returnKeyType={'done'}
                    // onSubmitEditing={() => passwordRef.current.focus()}
                  />
                </View>

                <BasicButton
                  style={styles.button}
                  textColor={buttonReady ? '#1D1E1E' : '#ffffff'}
                  width={104}
                  height={42}
                  textSize={13}
                  margin={[0, 0, 0, 8]}
                  disabled={!buttonReady}
                  border={true}
                  backgroundColor={buttonReady ? '#AEFFC1' : 'transparent'}
                  text="인증번호받기"
                  hasMarginBottom
                  onPress={async () =>
                    verifyPhoneNumber(
                      `+82 ${form.mobileNumber.slice(
                        0,
                        3,
                      )}-${form.mobileNumber.slice(
                        3,
                        7,
                      )}-${form.mobileNumber.slice(7, 11)}`,
                    )
                  }
                />
              </View>
              <Text style={[styles.invalidNumber, {color: textColor}]}>
                {validNumber}
              </Text>
            </View>

            <View style={styles.form} hasMarginBottom>
              <Text style={styles.contentText}>인증번호</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="인증번호를 입력해주세요"
                    value={form.code}
                    onChangeText={createChangeTextHandler('code')}
                    // secureTextEntry
                    // ref={passwordRef}
                    keyboardType="numeric"
                    // returnKeyType={'done'}
                    onSubmitEditing={() => {
                      onSubmit();
                    }}
                  />
                </View>

                <BasicButton
                  style={styles.button}
                  textColor={buttonReady ? '#1D1E1E' : '#ffffff'}
                  width={104}
                  height={42}
                  textSize={13}
                  margin={[0, 0, 0, 8]}
                  disabled={!buttonReady}
                  border={true}
                  backgroundColor={buttonReady ? '#AEFFC1' : 'transparent'}
                  text="인증하기"
                  hasMarginBottom
                  onPress={() => confirmCode()}
                />
              </View>
              <Text
                style={[
                  styles.invalidNumber,
                  {color: confirmTextColor, marginBottom: 90},
                ]}>
                {confirmNo === null
                  ? ''
                  : confirmNo
                  ? '성공적으로 인증되었습니다'
                  : '인증번호가 유효하지 않습니다.'}
              </Text>
            </View>

            {/* <BasicButton
              style={styles.button}
              width={300}
              height={40}
              textSize={17}
              margin={[50, 5, 5, 5]}
              border={false}
              disabled={!verified}
              backgroundColor={verified ? 'black' : 'lightgray'}
              text="다음 단계"
              hasMarginBottom
              onPress={goToNextPage}
            /> */}
          </ScrollView>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>탈퇴하기</Text>
          </TouchableOpacity>
          <DoubleModal
            text="MEMINT를 탈퇴하시겠습니까?"
            nButtonText="아니요"
            pButtonText="네"
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            pFunction={() => {
              handleFinalDelete();
            }}
            nFunction={() => {
              setModalVisible(!modalVisible);
            }}
            x
          />
        </View>
      </KeyboardAvoidingView>
      {/* </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#ABDCC1',
  },
  fullscreen: {
    paddingHorizontal: 15,
    flex: 1,
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 15,
    color: '#1D1E1E',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  invalidNumber: {
    fontSize: 14,
    marginVertical: 10,
    letterSpacing: -0.5,
    // marginBottom: 20,
    // marginRight: 100,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  contentText: {
    fontSize: 14,
    letterSpacing: -0.5,
    marginBottom: 8,
    color: '#1D1E1E',
    // fontWeight: 'bold',
  },
  contentTextSub: {
    fontSize: 18,
    margin: 8,
    letterSpacing: -0.5,

    // fontWeight: 'bold',
  },
  form: {
    marginTop: 32,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
  button: {
    // marginTop: 'auto',
    // marginBottom: 30,
    marginHorizontal: 15,
    backgroundColor: '#ffffff',
    width: '100%',
    height: 50,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,

    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
  inputWrap: {
    flex: 1,
  },
  backButton: {
    marginLeft: 15,
  },
});

export default ReverifyForDelete;
