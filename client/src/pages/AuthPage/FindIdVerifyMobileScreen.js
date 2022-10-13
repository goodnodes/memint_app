import React, {useRef, useState} from 'react';
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
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import {getUserByPhoneNumber} from '../../lib/Users';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {useIsFocused} from '@react-navigation/native';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

const FindIdVerifyMobileScreen = ({navigation}) => {
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
  const [email, setEmail] = useState(null);
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
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setFiexedPhoneNumber(form.mobileNumber);
    setConfirm(confirmation);
  }

  // Handle confirm code button press
  async function confirmCode() {
    try {
      await confirm.confirm(form.code);
      setVerified(true);
      setVerifyTextColor('#58FF7D');
      auth().signOut();
      getUserByPhoneNumber(fixedPhoneNumber).then(result => {
        if (result) {
          setEmail(result);
        } else {
          setEmail('NA');
        }
      });
    } catch (error) {
      console.log(error);
      console.log('Invalid code.');
      setVerified(false);
      setVerifyTextColor('#FF5029');
    }
  }

  const goToNextPage = () => {
    navigation.push('SignIn');
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
          <View style={styles.fullscreenSub}>
            <Text style={styles.title}>Find ID with My Information</Text>
            <Text style={styles.contentTextSub}>
              Please enter the mobile phone number you used to sign up.
            </Text>
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
                    autoCorrect={false}
                    returnKeyType={'done'}
                    // onSubmitEditing={() => passwordRef.current.focus()}
                  />
                </View>
                <BasicButton
                  width={104}
                  height={42}
                  textSize={13}
                  margin={[0, 0, 0, 8]}
                  disabled={!buttonReady}
                  textColor={buttonReady ? '#1D1E1E' : '#ffffff'}
                  backgroundColor={buttonReady ? '#AEFFC1' : 'transparent'}
                  border={true}
                  text="Submit"
                  onPress={async () =>
                    verifyPhoneNumber(
                      `+82 ${form.mobileNumber.slice(
                        0,
                        3,
                      )}-${form.mobileNumber.slice(
                        3,
                        7,
                      )}-${form.mobileNumber.slice(7, 11)}`,
                    ).then(setValidNumber('Verification code has been sent'))
                  }
                />
              </View>
              <Text style={[styles.invalidNumber, {color: textColor}]}>
                {validNumber}
              </Text>
            </View>

            <View style={styles.form}>
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
                  textColor={buttonReady ? '#1D1E1E' : '#ffffff'}
                  backgroundColor={buttonReady ? '#AEFFC1' : 'transparent'}
                  disabled={!buttonReady}
                  width={104}
                  height={42}
                  textSize={13}
                  margin={[0, 0, 0, 8]}
                  border={true}
                  text="Verify"
                  onPress={() => confirmCode()}
                />
              </View>
            </View>
            <Text style={[styles.invalidNumber, {color: verifyTextColor}]}>
              {verified === null
                ? ''
                : verified
                ? 'Successfully verified'
                : 'Invalid verification code'}
            </Text>
            <Text style={styles.text}>
              {email === 'NA'
                ? "There's no member matches the mobile phone number"
                : email
                ? `The email you signed up for is ${email}`
                : null}
            </Text>
            {/* <BasicButton
            width={300}
            height={40}
            textSize={17}
            margin={[50, 5, 5, 5]}
            border={false}
            // disabled={!verified}
            // backgroundColor={verified ? 'black' : 'lightgray'}
            text="로그인 하러 가기"
            hasMarginBottom
            onPress={goToNextPage}
          /> */}
            <TouchableOpacity style={styles.button} onPress={goToNextPage}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#3C3D43',
  },
  fullscreen: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',

    // justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 160,
    marginTop: 70,
    marginBottom: 20,
  },
  invalidNumber: {
    fontSize: 14,
    marginVertical: 10,
    letterSpacing: -0.5,
    // marginBottom: 20,
    // marginRight: 100,
  },
  text: {
    marginTop: 50,
    fontSize: 15,
    color: '#ffffff',
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
  contentText: {
    fontSize: 14,
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  contentTextSub: {
    fontSize: 14,
    color: '#ffffff',
    // fontWeight: 'bold',
  },
  contentTextVerify: {
    fontSize: 18,
    marginTop: 50,
    marginBottom: 10,
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
  inputWrap: {
    flex: 1,
  },
  button: {
    marginTop: 'auto',
    marginBottom: 30,
    backgroundColor: '#AEFFC1',
    width: '100%',
    height: 50,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',

    // position: 'absolute',
    // bottom: 20,
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
});

export default FindIdVerifyMobileScreen;
