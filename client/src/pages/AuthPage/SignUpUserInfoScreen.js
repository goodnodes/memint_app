import React, {useState} from 'react';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import BasicButton from '../../components/common/BasicButton';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import BackButton from '../../components/common/BackButton';
import CameraButton from '../../components/AuthComponents/CameraButton';
import {signUp} from '../../lib/Auth';
import {createUser, getUser} from '../../lib/Users';
import storage from '@react-native-firebase/storage';
import {getImgUrl} from '../../lib/NFT';
import {useToast} from '../../utils/hooks/useToast';
import {createWallet} from '../../lib/api/wallet';
import SafeStatusBar from '../../components/common/SafeStatusBar';
// const reference = storage().ref('/directory/filename.png');
// await reference.putFile(uri);
// const url = await reference.getDownloadURL();

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

const SignUpUserInfoScreen = ({navigation, route}) => {
  let {userInfo} = route.params || {};
  const {showToast} = useToast();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [validNickname, setValidNickname] = useState(true);
  const [form, setForm] = useState({
    nickName: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
  });

  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
    if (name === 'nickName') {
      //calculate byte size
      let str_character;
      let size = 0;
      for (let k = 0; k < value.length; k++) {
        str_character = value.charAt(k);
        if (escape(str_character).length > 4) size += 2;
        else size++;
      }

      if (size > 14) {
        setValidNickname(false);
      } else {
        setValidNickname(true);
      }
    }
  };
  const onSubmit = async () => {
    try {
      if (
        !validNickname ||
        response === null ||
        form.nickName === '' ||
        form.birthYear === '' ||
        form.birthMonth === '' ||
        form.birthDay === '' ||
        form.gender === ''
      ) {
        // Alert.alert('실패', '회원 정보를 올바르게 입력해주세요');
        showToast('error', '회원 정보를 올바르게 입력해주세요.');
      } else {
        Keyboard.dismiss();
        setLoading(true);
        userInfo = {
          ...userInfo,
          photoRes: response,
          nickName: form.nickName,
          birthYear: form.birthYear,
          birthMonth: form.birthMonth,
          birthDay: form.birthDay,
          gender: form.gender,
        };
        // let photoURL = null;
        // if (response) {
        //   const asset = response.assets[0];
        //   const extension = asset.fileName.split('.').pop(); //확장자 추출
        //   const reference = storage().ref(`/profile/${uid}.${extension}`);

        //   if (Platform.OS === 'android') {
        //     await reference.putString(asset.base64, 'base64', {
        //       contentType: asset.type,
        //     });
        //   } else {
        //     await reference.putFile(asset.uri);
        //   }

        //   photoURL = response ? await reference.getDownloadURL() : null;
        // }

        // createUser({
        //   userId: uid,
        //   email: email,
        //   nickName: form.nickName,
        //   gender: form.gender,
        //   birth: `${form.birthYear}년 ${form.birthMonth}월 ${form.birthDay}일`,
        //   picture: photoURL,
        // });
        // //create Wallet
        // const body = {
        //   id: uid,
        // };
        // console.log(body);
        // await createWallet(body);
        navigation.push('VerifyMobile', {userInfo});
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.fullscreenSub}>
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#58FF7D" />
        </View>
      </SafeAreaView>
    );
  }
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
          <ScrollView
            style={styles.fullscreenSub}
            contentContainerStyle={styles.paddingBottom}>
            <Text style={styles.title}>프로필 설정</Text>
            <Text style={styles.alertText}>
              본인의 얼굴이 잘 나온 사진을 올려주세요.{'\n'}
              본인 얼굴이 아닌 다른 이미지 사용 시 서비스 이용에 제한이 있어요.
            </Text>
            <View style={styles.cameraArea}>
              <CameraButton response={response} setResponse={setResponse} />
            </View>
            <View style={styles.form}>
              <Text style={styles.infoText}>닉네임</Text>
              <BorderedInput
                size="wide"
                // placeholder="닉네임"
                value={form.nickName}
                onChangeText={createChangeTextHandler('nickName')}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType={'next'}
              />

              <Text
                style={[
                  styles.validNickname,
                  {color: validNickname ? '#3C3D43' : 'red'},
                ]}>
                너무 긴 닉네임입니다.
              </Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.infoText}>생년월일</Text>
              <View style={styles.birthform}>
                <SelectDropdown
                  data={[
                    '1992',
                    '1993',
                    '1994',
                    '1995',
                    '1996',
                    '1997',
                    '1998',
                    '1999',
                    '2000',
                    '2001',
                    '2002',
                    '2003',
                  ]}
                  onSelect={(selectedItem, index) => {
                    setForm({...form, birthYear: selectedItem});
                  }}
                  defaultButtonText=" "
                  buttonStyle={
                    form.birthYear ? styles.borderedDropdown : styles.dropdown
                  }
                  dropdownStyle={styles.dropdownStyle}
                  rowTextStyle={styles.dropdownTextStyle}
                  buttonTextStyle={styles.buttonTextStyle}
                  position={'bottom'}
                />
                <Text style={styles.infoText}> 년 </Text>
                <SelectDropdown
                  data={[
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                  ]}
                  onSelect={(selectedItem, index) => {
                    setForm({...form, birthMonth: selectedItem});
                  }}
                  defaultButtonText=" "
                  buttonStyle={
                    form.birthMonth
                      ? styles.borderedDropdownSmall
                      : styles.dropdownSmall
                  }
                  dropdownStyle={styles.dropdownStyle}
                  rowTextStyle={styles.dropdownTextStyle}
                  buttonTextStyle={styles.buttonTextStyle}
                />
                <Text style={styles.infoText}> 월 </Text>
                <SelectDropdown
                  data={[
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                    '24',
                    '25',
                    '26',
                    '27',
                    '28',
                    '29',
                    '30',
                    '31',
                  ]}
                  onSelect={(selectedItem, index) => {
                    setForm({...form, birthDay: selectedItem});
                  }}
                  defaultButtonText=" "
                  buttonStyle={
                    form.birthDay
                      ? styles.borderedDropdownSmall
                      : styles.dropdownSmall
                  }
                  dropdownStyle={styles.dropdownStyle}
                  rowTextStyle={styles.dropdownTextStyle}
                  buttonTextStyle={styles.buttonTextStyle}
                />
                <Text style={styles.infoText}> 일 </Text>
              </View>
            </View>
            <View style={styles.form}>
              <Text style={styles.infoText}>성별</Text>
              <SelectDropdown
                data={['남자', '여자']}
                onSelect={(selectedItem, index) => {
                  setForm({...form, gender: selectedItem});
                }}
                defaultButtonText=" "
                buttonStyle={
                  form.gender ? styles.borderedDropdown : styles.dropdown
                }
                dropdownStyle={styles.dropdownStyleGender}
                rowTextStyle={styles.dropdownTextStyle}
                buttonTextStyle={styles.buttonTextStyle}
              />
            </View>
            <View style={styles.alertTextArea}>
              <Text style={styles.alertText}>
                닉네임, 생년월일, 성별 등 개인을 식별할 수 있는 정보는{'\n'}
                추후 수정이 불가능합니다.
              </Text>
            </View>

            {/* <BasicButton
            style={styles.button}
            width={300}
            height={40}
            textSize={17}
            margin={[5, 5, 5, 5]}
            text="다음 단계"
            hasMarginBottom
            onPress={onSubmit}
          /> */}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
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
  validNickname: {
    marginTop: 5,
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
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontWeight: '400',
    marginTop: 20,
    marginBottom: 15,
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  alertTextArea: {
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 60,
  },
  alertText: {
    marginTop: 30,
    fontSize: 14,
    letterSpacing: -0.5,
    color: '#ffffff',
    lineHeight: 18.2,
  },
  contentTextSub: {
    fontSize: 18,
    margin: 8,
    letterSpacing: -0.5,

    // fontWeight: 'bold',
  },
  contentTextVerify: {
    fontSize: 18,
    marginTop: 20,
    letterSpacing: -0.5,

    // fontWeight: 'bold',
  },
  cameraArea: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  form: {
    // position: 'static',
    marginBottom: 26,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  birthform: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  genderForm: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dropdown: {
    width: 120,
    borderColor: '#EAFFEF',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 40,
    backgroundColor: 'transparent',
  },
  dropdownSmall: {
    width: 70,
    borderWidth: 1,
    borderColor: '#EAFFEF',
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: '#3C3D43',
    borderRadius: 5,
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownStyle: {
    backgroundColor: '#3C3D43',
    borderRadius: 10,
    height: 185,
  },
  dropdownStyleGender: {
    height: 100,
    backgroundColor: '#3C3D43',
    borderRadius: 10,
  },
  dropdownTextStyle: {
    color: '#ffffff',
    fontSize: 14,
  },
  buttonTextStyle: {
    color: '#ffffff',
    fontSize: 14,
  },
  button: {
    // marginTop: 'auto',
    // marginBottom: 30,
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
    marginHorizontal: 15,
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
  paddingBottom: {
    paddingBottom: 80,
  },
  borderedDropdown: {
    width: 120,
    // borderColor: '#EAFFEF',
    // borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 40,
    backgroundColor: 'transparent',
    borderColor: '#AEFFC1',
    borderWidth: 2,
  },
  borderedDropdownSmall: {
    width: 70,
    borderWidth: 2,
    borderColor: '#AEFFC1',
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: '#3C3D43',
    borderRadius: 5,
  },
});

export default SignUpUserInfoScreen;
