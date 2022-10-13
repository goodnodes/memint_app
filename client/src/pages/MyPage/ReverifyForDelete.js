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
  Platform,
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
    'Please enter an 11-digit phone number',
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
        setValidNumber('Please enter an 11-digit phone number');
        setTextColor('#EAFFEF');
      } else if (value !== userInfo.phoneNumber) {
        setButtonReady(false);
        setValidNumber('Invalid phone number');
        setTextColor('#FF5029');
      } else if (value === userInfo.phoneNumber) {
        setButtonReady(true);
        setValidNumber('Valid phone number.');
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
        setValidNumber('Authenticate code has been sent');
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
      } catch (e) {
        const messages = {
          'auth/too-many-requests': `Too many requests. ${'\n'} Please try again in a moment.`,
        };
        const msg = messages[e.code];
        Alert.alert('실패', msg);
        console.log(e);
      }
    } else {
      showToast('error', 'Please authenticate your password first.');
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
      showToast(
        'error',
        'Please authenticate your password and mobile number.',
      );
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}> */}
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}>
        <StatusBar barStyle="dark-content" />
        <View style={{backgroundColor: '#ABDCC1', height: top}} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.pop()}>
            <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
            {/* <Text style={styles.buttonText}>Back</Text> */}
          </TouchableOpacity>
        </View>

        <View style={styles.fullscreen}>
          <Text style={styles.title}>Authenticate</Text>
          <Text style={styles.contentText}>
            Please authenticate your password and mobile number for safe
            withdrawal.
          </Text>

          <ScrollView style={styles.fullscreenSub}>
            <View style={styles.form}>
              <Text style={styles.contentText}>Password</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="Please enter Password"
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
                  text="Submit"
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
                  ? 'confirmed.'
                  : 'Invalid password.'}
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.contentText}>Mobile</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="Please enter mobile number"
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
                  text="Submit"
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
              <Text style={styles.contentText}>Authentication code</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="Please enter Authentication code"
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
                  text="Authenticate"
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
                  ? 'Successfully authenticated'
                  : 'Invalid authentication code.'}
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
            <Text style={styles.buttonText}>Withdrawal</Text>
          </TouchableOpacity>
          <DoubleModal
            text="Do you really want to leave Memint"
            nButtonText="No"
            pButtonText="Yes"
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    height: 50,
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
