import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import CheckElement from '../../components/AuthComponents/CheckElement';
import CheckBox from '@react-native-community/checkbox';
import {signUp, signIn} from '../../lib/Auth';
import GradientButton from '../../components/common/GradientButton';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {createUser, getUser} from '../../lib/Users';
import storage from '@react-native-firebase/storage';
import {createWallet} from '../../lib/api/wallet';
import {createNFT, getImgUrl} from '../../lib/NFT';
import {createUserNFT} from '../../lib/Users';
import {getNFTs, getProfile, getMemin} from '../../lib/NFT';
import useNftActions from '../../utils/hooks/UseNftActions';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import useUser from '../../utils/hooks/UseUser';
import {useToast} from '../../utils/hooks/useToast';

const SignUpAgreementScreen = ({navigation, route}) => {
  let {userInfo} = route.params || {};
  const {saveNFT, setNftProfile, setMemin} = useNftActions();
  const userState = useUser();
  const {saveInfo} = useAuthActions();
  const [checkInfo, setCheckInfo] = useState({
    service: '',
    privacy: '',
    age: '',
    event: '',
    all: '',
  });
  const [loading, setLoading] = useState(false);
  const {showToast} = useToast();
  const onSubmitSignUp = async () => {
    if (!(serviceCheck && ageCheck && useCheck)) {
      // Alert.alert('실패', '약관에 동의해주세요');
      showToast('error', '약관에 동의해주세요');
    } else {
      try {
        setLoading(true);
        //SignUp User
        const {user} = await signUp({
          email: userInfo.email,
          password: userInfo.password,
        });
        //add photo in storage
        let photoURL = null;
        if (userInfo.photoRes) {
          const asset = userInfo.photoRes.assets[0];
          const extension = asset.fileName.split('.').pop(); //확장자 추출
          const reference = storage().ref(`/profile/${user.uid}.${extension}`);
          if (Platform.OS === 'android') {
            await reference.putString(asset.base64, 'base64', {
              contentType: asset.type,
            });
          } else {
            await reference.putFile(asset.uri);
          }
          photoURL = userInfo.photoRes
            ? await reference.getDownloadURL()
            : null;
        }
        const res = await createNFT({
          userId: user.uid,
          nftImg: userInfo.nftImg,
        });
        const newNFTId = res._documentPath._parts[1];
        setNftProfile(userInfo.nftImg);
        await createUser({
          userId: user.uid,
          email: userInfo.email,
          nickName: userInfo.nickName,
          gender: userInfo.gender,
          birth: `${userInfo.birthYear}년 ${userInfo.birthMonth}월 ${userInfo.birthDay}일`,
          picture: photoURL,

          phoneNumber: userInfo.phoneNumber,
          drinkCapa: userInfo.drinkCapa,
          drinkStyle: userInfo.drinkStyle,
          alcoholType: userInfo.alcoholType,
          marketingAgreement: marketingCheck,
        });
        await createUserNFT({
          userId: user.uid,
          nftProfile: userInfo.nftImg,
          nftId: newNFTId,
        });
        //create Wallet
        const body = {
          id: user.uid,
        };
        const account = await createWallet(body);
        ///////Sigin In process
        const userDetail = await getUser(user.uid);
        const response = await getNFTs(user.uid);
        const nfts = response.docs.map(el => {
          return {...el.data()};
        });
        saveNFT(nfts);
        setNftProfile(...getProfile(nfts));
        setMemin(...getMemin(nfts));

        ////////////////////
        await signIn({email: userInfo.email, password: userInfo.password});
        saveInfo({
          ...userState,
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
          nftProfile: userDetail.nftProfile.toString(),
          property: {
            alcoholType: userDetail.property.alcoholType,
            drinkCapa: userDetail.property.drinkCapa,
            drinkStyle: userDetail.property.drinkStyle,
          },
          visibleUser: userDetail.visibleUser,
          likesroomId: userDetail.likesroomId,
          marketingAgreement: marketingCheck,
          isActivated: userDetail.isActivated,
          selfIntroduction: userDetail.selfIntroduction,
          isReadyToGetFreeToken: userDetail.isReadyToGetFreeToken,
        }),
          navigation.navigate('Main');
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
      // navigation.push('SignUpAlarm', {userInfo});
    }
    // const {email, password} = route.params;
    // const info = {email, password};
    // setLoading(true);
    // try {
    //   // const {user} = await signUp(info);
    //   // console.log(user);
    // } catch (e) {
    //   Alert.alert('실패');
    //   console.log(e);
    // } finally {
    //   setLoading(false);
    //   navigate('SignUpAlarm');
    // }
  };

  const [allCheck, setAllCheck] = useState(false);
  const [serviceCheck, setServiceCheck] = useState(false);
  const [ageCheck, setAgeCheck] = useState(false);
  const [useCheck, setUseCheck] = useState(false);
  const [marketingCheck, setMarketingCheck] = useState(false);

  const allBtnEvent = () => {
    if (allCheck === false) {
      setAllCheck(true);
      setServiceCheck(true);
      setAgeCheck(true);
      setUseCheck(true);
      setMarketingCheck(true);
    } else {
      setAllCheck(false);
      setServiceCheck(false);
      setAgeCheck(false);
      setUseCheck(false);
      setMarketingCheck(false);
    }
  };

  const ageBtnEvent = () => {
    if (ageCheck === false) {
      setAgeCheck(true);
    } else {
      setAgeCheck(false);
    }
  };

  const serviceBtnEvent = () => {
    if (serviceCheck === false) {
      setServiceCheck(true);
    } else {
      setServiceCheck(false);
    }
  };

  const useBtnEvent = () => {
    if (useCheck === false) {
      setUseCheck(true);
    } else {
      setUseCheck(false);
    }
  };

  const marketingBtnEvent = () => {
    if (marketingCheck === false) {
      setMarketingCheck(true);
    } else {
      setMarketingCheck(false);
    }
  };

  useEffect(() => {
    if (
      ageCheck === true &&
      serviceCheck === true &&
      useCheck === true &&
      marketingCheck === true
    ) {
      setAllCheck(true);
    } else {
      setAllCheck(false);
    }
  }, [ageCheck, serviceCheck, useCheck, marketingCheck]);

  const goToNextPage = () => {
    navigation.push('SignUpAlarm', {userInfo});
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.fullscreenLoading}>
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#58FF7D" />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.fullscreen}>
      <SafeStatusBar />
      <BackButton />
      <View style={styles.fullscreenSub}>
        <Text style={styles.textMain}>서비스 약관</Text>
        <View style={styles.form}>
          <CheckBox
            style={styles.checkBox}
            value={serviceCheck}
            onChange={serviceBtnEvent}
            onCheckColor="#58FF7D"
            onTintColor="#58FF7D"
          />

          <Text style={styles.text}>서비스 약관에 동의</Text>
          <Text style={styles.textSub}>필수</Text>
        </View>
        <View style={styles.form}>
          <CheckBox
            style={styles.checkBox}
            value={useCheck}
            onChange={useBtnEvent}
            onCheckColor="#58FF7D"
            onTintColor="#58FF7D"
          />
          <Text style={styles.text}>개인정보 수집 및 이용동의</Text>
          <Text style={styles.textSub}>필수</Text>
        </View>
        <View style={styles.form}>
          <CheckBox
            style={styles.checkBox}
            value={ageCheck}
            onChange={ageBtnEvent}
            onCheckColor="#58FF7D"
            onTintColor="#58FF7D"
          />
          <Text style={styles.text}>만 19세 이상</Text>
          <Text style={styles.textSub}>필수</Text>
        </View>
        <View style={styles.form}>
          <CheckBox
            style={styles.checkBox}
            value={marketingCheck}
            onChange={marketingBtnEvent}
            onCheckColor="#58FF7D"
            onTintColor="#58FF7D"
          />
          <Text style={styles.text}>혜택 및 이벤트 알림 수신 동의</Text>
          <Text style={styles.textSub}>선택</Text>
        </View>
        <Text style={styles.contentText}>
          마케팅 수신 동의를 체크하지 않으면, 추천 모임 알림, 이벤트 소식 등 앱
          사용 멤버만을 위한 특별한 혜택 정보를 받을 수 없어요.
        </Text>
        <View style={styles.formAllAgree}>
          <CheckBox
            style={styles.checkBox}
            value={allCheck}
            onChange={allBtnEvent}
            onCheckColor="#58FF7D"
            onTintColor="#58FF7D"
          />
          <Text style={styles.text}>모두 동의합니다.</Text>
        </View>
        {/* <BasicButton
          style={styles.button}
          width={300}
          height={40}
          textSize={17}
          margin={[5, 5, 5, 5]}
          text="회원가입 완료"
          hasMarginBottom
          onPress={onSubmitSignUp}
        /> */}
        <TouchableOpacity style={styles.button} onPress={onSubmitSignUp}>
          <Text style={styles.buttonText}>회원가입 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#3C3D43',
  },
  fullscreenLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C3D43',
  },
  fullscreenSub: {
    paddingHorizontal: 15,

    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    // height: '50',
    marginTop: 20,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
  },
  formAllAgree: {
    marginTop: 20,
    marginBottom: 32,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  formText: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  textAllAgree: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  textMain: {
    fontWeight: '400',
    fontSize: 24,
    marginTop: 40,
    marginBottom: 30,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  textSub: {
    color: '#AEFFC1',
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.5,
    // fontWeight: 'bold',
    // margin: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  contentText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.5,
    marginHorizontal: 43,
    marginTop: 8,
    marginBottom: 20,
    color: '#EAFFEFCC',
    // marginTop: 30,
  },
  contentTextSub: {
    fontSize: 18,
    margin: 8,
  },
  contentTextVerify: {
    fontSize: 18,
    marginTop: 20,
  },
  tagsContainer: {
    flexWrap: 'wrap',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  secondForm: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdown: {
    fontSize: 10,
    width: 130,
    borderColor: '#bdbdbd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 30,
  },
  checkBox: {
    width: 20,
    height: 20,
  },
  button: {
    // marginTop: 'auto',
    // marginBottom: 30,
    marginHorizontal: 15,
    backgroundColor: '#AEFFC1',
    width: '100%',
    height: 50,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
});

export default SignUpAgreementScreen;
