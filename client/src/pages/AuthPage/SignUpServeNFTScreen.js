import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import LinearGradient from 'react-native-linear-gradient';
import memintDino from '../../assets/icons/memintDino.png';
import useUser from '../../utils/hooks/UseUser';
import * as Progress from 'react-native-progress';

import {createNFT, getImgUrl} from '../../lib/NFT';
import useNftActions from '../../utils/hooks/UseNftActions';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {useToast} from '../../utils/hooks/useToast';
import {useIsFocused} from '@react-navigation/native';
let interval = undefined;

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

const SignUpServeNFTScreen = ({navigation}) => {
  // let {userInfo} = route.params || {};
  const user = useUser();
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(0);
  // const {setNftProfile} = useNftActions();
  // const [profileImg, setProfileImg] = useState('');
  const {showToast} = useToast();
  // const getNFT = async () => {
  //   try {
  //     const nftProfileImg = await getImgUrl();

  //     setProfileImg(nftProfileImg);
  //   } catch (e) {
  //     showToast('error', 'NFT 이미지 불러오기가 실패했습니다.');
  //     console.log(e);
  //   }
  // };
  // useEffect(() => {
  //   getNFT();
  // }, []);

  useEffect(() => {
    if (running) {
      interval = setInterval(() => {
        setProgress(prev => prev + 1);
      }, 20);
    } else {
      clearInterval(interval);
    }
  }, [running]);

  useEffect(() => {
    if (progress === 100) {
      setRunning(false);
      clearInterval(interval);
    }
  }, [progress]);

  // const {nickName, uid} = route.params;
  //   console.log(nickName);
  //   console.log(uid);
  //   console.log(profileImg);

  const onSubmit = async () => {
    navigation.push('SignIn');
  };

  const spinValue = new Animated.Value(0);

  // First set up animation
  Animated.timing(spinValue, {
    toValue: 1,
    duration: 3000,
    easing: Easing.linear, // Easing is an additional import from react-native
    useNativeDriver: true, // To make use of native driver for performance
  }).start();

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.fullscreen}>
      {Platform.OS === 'ios' ? (
        <SafeStatusBar />
      ) : (
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor="#3C3D43"
          animated={true}
        />
      )}
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 1, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        {/* <BackButton /> */}
        <View style={styles.fullscreenSub}>
          {progress === 100 ? (
            <View style={styles.progressdoneArea}>
              <Text style={styles.textMain}>
                {user.nickName}님을 위한 프로필
              </Text>
              <Image style={styles.nftImg} source={{uri: user.nftProfile}} />
              <Text style={styles.textSub}>잘 부탁드려요!</Text>
              <TouchableOpacity style={styles.button} onPress={onSubmit}>
                <Text style={styles.buttonText}>다음</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.textMain}>
                {user.nickName}님만을 위한{'\n'} 프로필 이미지를 준비 중입니다!
              </Text>

              <Animated.Image
                source={memintDino}
                style={[styles.logo, {transform: [{rotate: spin}]}]}
              />
              <Text style={styles.textSub}>두근두근...</Text>
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  nftImg: {
    width: 200,
    height: 200,
    borderColor: '#58FF7D',
    borderWidth: 3,
    borderRadius: 999,
    marginBottom: 15,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 15,
  },
  KeyboardAvoidingView: {
    flex: 1,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullscreenSub: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
    // height: '50',
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    // justifyContent: 'space-around',
    alignItems: 'center',
  },
  formAllAgree: {
    marginTop: 20,
    marginBottom: 32,
    width: '100%',
    paddingHorizontal: 16,
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
    fontSize: 20,
  },
  textAllAgree: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  textMain: {
    fontWeight: '400',
    fontSize: 18,
    marginVertical: 20,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 26,
  },
  textSub: {
    paddingHorizontal: 6,
    fontWeight: '400',
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    margin: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  contentText: {
    fontSize: 12,
    marginHorizontal: 50,
    paddingHorizontal: 30,
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
  logo: {
    width: 101,
    height: 108.77,
    marginBottom: 15,
  },
  button: {
    marginTop: 'auto',
    marginBottom: 30,
    // marginHorizontal: 15,
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

    // position: 'absolute',
    // bottom: 20,
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
  progressdoneArea: {
    marginTop: 120,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
});

export default SignUpServeNFTScreen;
