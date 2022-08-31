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
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import GradientButton from '../../components/common/GradientButton';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {reauthenticate, setNewPassword} from '../../lib/Auth';
import {useToast} from '../../utils/hooks/useToast';
const ChangePw = ({navigation}) => {
  const [verified, setVerified] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [verifyTextColor, setVerifyTextColor] = useState('gray');
  const [confirmTextColor, setconfirmTextColor] = useState('gray');
  const [form, setForm] = useState({
    currentPw: '',
    newPw: '',
    confirmPw: '',
  });
  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
    if (name === 'confirmPw') {
      if (value !== form.newPw) {
        setConfirmed(false);
        setconfirmTextColor('#FF5029');
      } else {
        setConfirmed(true);
        setconfirmTextColor('#58FF7D');
      }
    }
  };
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const {showToast} = useToast();

  const onCheckPw = async () => {
    const reauthentication = await reauthenticate(form.currentPw);
    if (reauthentication) {
      setVerified(true);
      setVerifyTextColor('#58FF7D');
    } else {
      setVerified(false);
      setVerifyTextColor('#FF5029');
    }
  };

  const onSubmitPw = () => {
    if (verified && confirmed) {
      setNewPassword(form.newPw);
      showToast('success', '비밀번호가 변경되었습니다.');
      navigation.pop();
    } else {
      showToast('error', '입력한 정보를 확인해주세요.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={'padding'}>
        <SafeStatusBar />

        <BackButton />
        <View style={styles.fullscreen}>
          <Text style={styles.title}>비밀번호 변경</Text>

          <ScrollView style={styles.fullscreenSub}>
            <View style={styles.form}>
              <Text style={styles.infoText}>현재 비밀번호</Text>
              <BorderedInput
                size="wide"
                placeholder="현재 비밀번호"
                value={form.currentPw}
                onChangeText={createChangeTextHandler('currentPw')}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType={'done'}
                secureTextEntry
                onSubmitEditing={() => {
                  passwordRef.current.focus();
                  onCheckPw();
                }}
              />
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
              <Text style={styles.infoText}>새로운 비밀번호</Text>
              <BorderedInput
                size="wide"
                placeholder="새로운 비밀번호"
                value={form.newPw}
                onChangeText={createChangeTextHandler('newPw')}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType={'next'}
                secureTextEntry
                ref={passwordRef}
                onSubmitEditing={() => confirmPasswordRef.current.focus()}
              />
            </View>
            <View style={[styles.form, styles.padding]}>
              <Text style={styles.infoText}>비밀번호 확인 </Text>
              <BorderedInput
                size="wide"
                placeholder="비밀번호 확인"
                value={form.confirmPw}
                onChangeText={createChangeTextHandler('confirmPw')}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType={'done'}
                secureTextEntry
                ref={confirmPasswordRef}
              />
              <Text
                style={[
                  styles.invalidNumber,
                  {color: confirmTextColor, marginBottom: 10},
                ]}>
                {confirmed === null
                  ? ''
                  : confirmed
                  ? '비밀번호가 일치합니다.'
                  : '비밀번호가 일치하지 않습니다.'}
              </Text>
            </View>
            {/* <BasicButton
              style={styles.button}
              width={200}
              height={40}
              textSize={17}
              margin={[30, 5, 5, 5]}
              text="다음 단계"
              hasMarginBottom
              onPress={onSubmitSignUp}
            /> */}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={onSubmitPw}>
            <Text style={styles.buttonText}>비밀번호 바꾸기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ABDCC1',
  },
  fullscreen: {
    flex: 1,
    paddingHorizontal: 15,
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingHorizontal: 15,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginVertical: 20,
    color: 'black',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  infoText: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  form: {
    marginTop: 16,
    marginBottom: 10,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  spinnerWrapper: {
    marginTop: 254,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padding: {
    marginBottom: 90,
  },
  invalidNumber: {
    fontSize: 14,
    marginVertical: 10,
    letterSpacing: -0.5,
    // marginBottom: 20,
    // marginRight: 100,
  },
});

export default ChangePw;
