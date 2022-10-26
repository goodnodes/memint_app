import React, {useRef, useState} from 'react';

import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import OauthButton from '../../components/AuthComponents/OauthButton';
import SignForm from '../../components/AuthComponents/SignForm';
import SignButtons from '../../components/AuthComponents/SignButtons';
import useAuth from '../../utils/hooks/UseAuth';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {signIn} from '../../lib/Auth';
import {getUser, getUserProperty} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';
import useNftActions from '../../utils/hooks/UseNftActions';
import {getNFTs, getProfile, getMemin, calcHumanElement} from '../../lib/NFT';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import memintLogo from '../../assets/icons/memintLogo.png';
import {useToast} from '../../utils/hooks/useToast';
import {useIsFocused} from '@react-navigation/native';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

const SignInScreen = ({navigation, route}) => {
  const userInfo = useUser();
  const {showToast} = useToast();

  const {saveInfo} = useAuthActions();
  const {saveNFT, setNftProfile, setMemin} = useNftActions();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
  };
  const [loading, setLoading] = useState();
  const goToSignUp = () => {
    Keyboard.dismiss();
    // navigation.navigate('SignUp');
    navigation.navigate('SignUp');
  };

  const onSubmitSignIn = async () => {
    Keyboard.dismiss();
    const {email, password} = form;
    const info = {email, password};
    setLoading(true);
    try {
      const {user} = await signIn(info);
      const userDetail = await getUser(user.uid);
      const userProperty = await getUserProperty(user.uid);

      const res = await getNFTs(user.uid);
      const nfts = res.docs.map(el => {
        return {...el.data()};
      });
      saveNFT(nfts);
      setNftProfile(...getProfile(nfts));
      setMemin(...getMemin(nfts));

      saveInfo({
        ...userInfo,
        id: user.uid,
        email: user.email,
        nickName: userDetail.nickName,
        gender: userDetail.gender,
        birth: userDetail.birth,
        nftIds: userDetail.nftIds,
        picture: userDetail.picture,
        address: userDetail.address,
        phoneNumber: userDetail.phoneNumber,
        tokenAmount: userDetail.tokenAmount,
        klayAmount: userDetail.klayAmount,
        onChainTokenAmount: userDetail.onChainTokenAmount,
        nftProfile: userDetail.nftProfile,
        property: userDetail.property,
        visibleUser: userDetail.visibleUser,
        marketingAgreement: userDetail.marketingAgreement,
        isActivated: userDetail.isActivated,
        selfIntroduction: userDetail.selfIntroduction,
        isReadyToGetFreeToken: userDetail.isReadyToGetFreeToken,
        meminStats: {
          HumanElement: calcHumanElement(
            userDetail.meminStats.grade,
            userDetail.meminStats.level,
          ),
          energyRechargeTime: userDetail.meminStats.energyRechargeTime,
          receivedFeedbackCount: userDetail.meminStats.receivedFeedbackCount,
          dino: userDetail.meminStats.dino,
          energy: userDetail.meminStats.energy,
          resilience: userDetail.meminStats.resilience,
          charm: userDetail.meminStats.charm,
          grade: userDetail.meminStats.grade,
          exp: userDetail.meminStats.exp,
          level: userDetail.meminStats.level,
        },
      }),
        navigation.reset({routes: [{name: 'Main'}]});
    } catch (e) {
      showToast('error', '로그인 실패');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const goToFindId = () => {
    navigation.navigate('FindIdVerifyMobile');
  };
  const goToFindPW = () => {
    navigation.navigate('FindPWVerify');
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.fullscreen}>
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

        <View style={styles.fullscreen}>
          <Image source={memintLogo} style={styles.logo} />
          <View style={styles.form}>
            <SignForm
              onSubmit={onSubmitSignIn}
              form={form}
              createChangeTextHandler={createChangeTextHandler}
            />

            {/* <SignButtons onSubmitSignIn={goToMain} onSubmitSignUp={goToSignUp} /> */}
            <SignButtons
              onSubmitSignIn={onSubmitSignIn}
              onSubmitSignUp={goToSignUp}
            />
            <View style={styles.textContainer}>
              <Text style={styles.textAsk}>이미 회원이신가요?</Text>
              {/* <Text style={styles.textFind}>아이디 / 비밀번호 찾기</Text> */}
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.textFind} onPress={goToFindId}>
                  <Text style={styles.plainText}> 아이디 찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.textFind} onPress={goToFindPW}>
                  <Text style={styles.plainText}> 비밀번호 찾기</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={styles.oauthbutton}>
            <OauthButton
              style={styles.oauthbutton}
              size="wide"
              text="Google 계정으로 로그인"
              vendor="google"
              backgroundColor="#6699ff"
              hasMarginBottom
            />
            <OauthButton
              style={styles.oauthbutton}
              size="wide"
              text="Apple 계정으로 로그인"
              backgroundColor="#666666"
              vendor="apple"
            />
          </View> */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
  },
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#3C3D43',
    paddingBottom: 130,
  },
  gradientBackground: {
    flex: 1,
  },
  logo: {
    width: 116,
    height: 79,
    marginTop: 92,
    marginBottom: 64,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 60,
  },
  textAsk: {
    fontSize: 14,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  textFind: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
    marginLeft: 15,
    letterSpacing: -0.5,
  },
  form: {
    width: '100%',
    paddingHorizontal: 16,
  },
  plainText: {
    color: '#ffffff',
  },

  oauthbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    // paddingHorizontal: 16,
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
  },
});

export default SignInScreen;
