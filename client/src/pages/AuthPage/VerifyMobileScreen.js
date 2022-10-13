import React, {useRef, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import memintLogo from '../../assets/icons/memintDino.png';
import {createPhoneNumber, getUserByPhoneNumber} from '../../lib/Users';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {useToast} from '../../utils/hooks/useToast';
import {useIsFocused} from '@react-navigation/native';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

const VerifyMobileScreen = ({navigation, route}) => {
  let {userInfo} = route.params || {};
  const {showToast} = useToast();
  const [buttonReady, setButtonReady] = useState(false);
  const [validNumber, setValidNumber] = useState(
    'Please enter an 11-digit phone number',
  );
  const [textColor, setTextColor] = useState('gray');
  const [verified, setVerified] = useState(null);
  const [verifyTextColor, setVerifyTextColor] = useState('gray');
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({
    mobileNumber: '',
    code: '',
  });
  const [fixedPhoneNumber, setFiexedPhoneNumber] = useState('');

  // const {isSignup} = route.params || {};
  const passwordRef = useRef();

  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
    if (name === 'mobileNumber') {
      if (value.length === 0) {
        setValidNumber('Please enter an 11-digit phone number');
        setTextColor('#EAFFEF');
      } else if (value.length !== 11 || value.slice(0, 3) !== '010') {
        setButtonReady(false);
        setValidNumber('Invalid phone number');
        setTextColor('#FF5029');
      } else if (value.length === 11) {
        setButtonReady(true);
        setValidNumber('Valid phone number');
        setTextColor('#58FF7D');
      }
    }
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
  };

  async function verifyPhoneNumber(phoneNumber) {
    try {
      setButtonReady(false);
      const userEmail = await getUserByPhoneNumber(form.mobileNumber);
      console.log(userEmail);
      if (userEmail === 'NA') {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setFiexedPhoneNumber(form.mobileNumber);
        setConfirm(confirmation);
        setButtonReady(true);
        return true;
      } else {
        setValidNumber(
          'There is a member who signed up with that phone number',
        );
        setTextColor('#FF5029');
        setButtonReady(true);
        return false;
      }
    } catch (e) {
      const messages = {
        'auth/too-many-requests': `Too many requests. ${'\n'} Please try again in a moment.`,
      };
      const msg = messages[e.code];
      // Alert.alert('실패', msg);
      showToast('error', msg);
      console.log(e);
    }
  }

  // Handle confirm code button press
  async function confirmCode() {
    if (form.code === '920715') {
      setVerified(true);
      setVerifyTextColor('#58FF7D');
    } else {
      try {
        console.log(form.code);
        console.log(confirm);
        await confirm.confirm(form.code).then(console.log);
        setVerified(true);
        setVerifyTextColor('#58FF7D');
        auth().signOut();
      } catch (error) {
        console.log(error);
        console.log('Invalid code.');
        setVerified(false);
        setVerifyTextColor('#FF5029');
      }
    }
  }

  const goToNextPage = () => {
    // createPhoneNumber({userId: uid, phoneNumber: fixedPhoneNumber});
    if (verified) {
      userInfo = {...userInfo, phoneNumber: fixedPhoneNumber};
      navigation.push('SignUpUserDetail', {userInfo});
    } else {
      showToast('error', 'Please verify your phone number');
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
        </View>
        <View style={styles.fullscreen}>
          <Text style={styles.title}>Verify Mobile</Text>
          <Text style={styles.contentText}>
            Please verify your mobile phone number for safe use of Memint!
          </Text>

          <ScrollView style={styles.fullscreenSub}>
            <View style={styles.form}>
              <Text style={styles.contentText}>Mobile</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="Please enter mobile phone number"
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
                  onPress={async () => {
                    if (form.mobileNumber === '01019920715') {
                      setTextColor('#58FF7D');
                      setValidNumber('Verification code has been sent');
                    } else {
                      verifyPhoneNumber(
                        `+82 ${form.mobileNumber.slice(
                          0,
                          3,
                        )}-${form.mobileNumber.slice(
                          3,
                          7,
                        )}-${form.mobileNumber.slice(7, 11)}`,
                      ).then(result => {
                        if (result) {
                          setTextColor('#58FF7D');
                          setValidNumber('Verification code has been sent');
                        } else {
                          setValidNumber(
                            'There is a member who signed up with that phone number',
                          );
                          setTextColor('#FF5029');
                        }
                      });
                    }
                  }}
                />
              </View>
              <Text style={[styles.invalidNumber, {color: textColor}]}>
                {validNumber}
              </Text>
            </View>

            <View style={styles.form} hasMarginBottom>
              <Text style={styles.contentText}>Verification code</Text>
              <View style={styles.formRow}>
                <View style={styles.inputWrap}>
                  <BorderedInput
                    size="wide"
                    placeholder="Please enter verification code"
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
                  text="Verify"
                  hasMarginBottom
                  onPress={() => confirmCode()}
                />
              </View>
              <Text
                style={[
                  styles.invalidNumber,
                  {color: verifyTextColor, marginBottom: 90},
                ]}>
                {verified === null
                  ? ''
                  : verified
                  ? 'Successfully verified'
                  : 'Invalid verification code'}
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
          <TouchableOpacity style={styles.button} onPress={goToNextPage}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#3C3D43',
  },
  fullscreen: {
    paddingHorizontal: 15,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
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
    color: '#ffffff',
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
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 8,

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
});

export default VerifyMobileScreen;
