import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Linking,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CloseButton from '../../components/common/CloseButton';
import LinearGradient from 'react-native-linear-gradient';
import memintDino from '../../assets/icons/memintDino.png';
import randomBox from '../../assets/icons/randombox.png';
import bomb from '../../assets/icons/bomb.png';
import partyPopper from '../../assets/icons/partyPopper.png';
import celebrate from '../../assets/animations/celebrate.json';
import useUser from '../../utils/hooks/UseUser';
import * as Progress from 'react-native-progress';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {createNFT, getImgUrl} from '../../lib/NFT';
import useNftActions from '../../utils/hooks/UseNftActions';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {useToast} from '../../utils/hooks/useToast';
import {getMeeting, updateMeeting, createEventFlag} from '../../lib/Meeting';
let interval = undefined;

//만약 Android에서 애니메이션 문제 있을시 아래 블로그 참고
//https://velog.io/@swanious/react-native-lottie-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

const EventPage = ({route}) => {
  // let {userInfo} = route.params || {};
  const navigation = useNavigation();
  const [meetingInfo, setMeetingInfo] = useState(route.params.meetingInfo);

  const [eventItem, setEventItem] = useState('');
  const user = useUser();
  const [running, setRunning] = useState(true);
  const [progress, setProgress] = useState(0);

  const {showToast} = useToast();
  const AnimationRef = useRef(new Animated.Value(0));
  const animationProgress = useRef(new Animated.Value(0));
  const onEventHandler = async () => {
    if (AnimationRef) {
      // console.log(AnimationRef);
      await AnimationRef.current?.swing(700);
      // Animated.timing(AnimationRef.crruent, {
      //   duration: 700,
      //   iterationCount: 5,
      // }).start();

      Animated.timing(animationProgress.current, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(async () => {
        const res = await getMeeting(route.params.meetingInfo.id);
        await createEventFlag(route.params.meetingInfo.id, 'clicked');
        console.log(res._data.eventItem);
        setEventItem(res._data.eventItem);
      });
    }
  };
  // useEffect(() => {
  //   if (progress === 100) {
  //     setRunning(false);
  //     clearInterval(interval);
  //   }
  // }, [progress]);

  useEffect(() => {
    getMeetingInfo();
  }, []);
  const getMeetingInfo = async () => {
    const res = await getMeeting(route.params.meetingInfo.id);
    setMeetingInfo({id: res.id, ...res.data()});
  };

  const rednerMeminCrew = () => {
    return (
      <ScrollView>
        <View style={styles.eventTitle}>
          <Text style={styles.meetingTitle}>{meetingInfo.title}</Text>
          <Text style={styles.eventResult}>Event Results</Text>
          <Text style={styles.meetingTime}>
            Verified at{'  '}
            {meetingInfo?.confirmCreatedAt.toDate().toLocaleString('en')}
          </Text>
        </View>
        <View style={styles.popperArea}>
          <Image source={partyPopper} style={styles.partyPopper} />
          <Text style={styles.meetingTitle}>Congratulations on winning 🥳</Text>
          <Text style={styles.eventResult}>MEMIN CREW will coming to you!</Text>
        </View>
        <View style={styles.descriptionArea}>
          <Text style={styles.eventNotiTitle}>
            🦖MEMIN CREW🦖 Event Win Notice!
          </Text>
          <Text style={styles.eventNotiText}>
            MEMIN CREW Event is an event that Memint staff appears at your group
            dating place and presents a surprise gift.{'\n'}If you want to
            receive a gift from MEMIN CREW, please send the following to Memint
            Kakao channel.{'\n'}MEMIN CREW will be on the move as soon as
            possible :)
          </Text>
          <Text style={styles.eventNotiDesc}>
            1.{'   '}Screen capture of this page{'\n'}2.{'  '}Name and mobile
            number of host
            {'\n'}
            3.{'  '}Place where you guys are.
          </Text>
          <Text style={styles.grayTitle}>
            Gift present is not possible in the following cases.
          </Text>
          <Text style={styles.grayContent}>
            • If you didn't send a Kakao Talk contact within 2 hours of the
            group dating verification
            {'\n'}• If more than half of the group dating members are
            scattered(When MEMIN CREW arrives)
          </Text>
        </View>
      </ScrollView>
    );
  };
  const renderBlank = () => {
    return (
      <ScrollView>
        <View style={styles.eventTitle}>
          <Text style={styles.meetingTitle}>{meetingInfo.title}</Text>
          <Text style={styles.eventResult}>Event Results</Text>
          <Text style={styles.meetingTime}>
            Verified at{'  '}
            {meetingInfo?.confirmCreatedAt.toDate().toLocaleString('en')}
          </Text>
        </View>
        <View style={styles.bombArea}>
          <Image source={bomb} style={styles.partyPopper} />
          <Text style={styles.meetingTitle}>
            That's too bad. Please try next time 😭
          </Text>
        </View>
      </ScrollView>
    );
  };
  const goToKakao = async () => {
    Linking.openURL('http://pf.kakao.com/_RrRjxj/chat');
  };
  const onSubmit = async () => {
    navigation.navigate('Main');
  };

  const goToMeetingConfirm = () => {
    navigation.pop();
  };
  const spinValue = new Animated.Value(0);
  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  // First set up animation
  //   Animated.timing(spinValue, {
  //     toValue: 1,
  //     duration: 3000,
  //     easing: Easing.linear, // Easing is an additional import from react-native
  //     useNativeDriver: true, // To make use of native driver for performance
  //   }).start();
  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  // useEffect(() => {
  //   Animated.timing(animationProgress.current, {
  //     toValue: 1,
  //     duration: 5000,
  //     easing: Easing.linear,
  //     useNativeDriver: false,
  //   }).start();
  // }, []);
  console.log(eventItem, meetingInfo.eventStatus);

  return (
    <View style={styles.fullscreen}>
      {Platform.OS === 'ios' ? (
        <SafeStatusBar />
      ) : (
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor="#3D3E44"
          animated={true}
        />
      )}
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 1, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        {/* <View style={styles.fullscreenSub}> */}
        {eventItem !== '' ? (
          <View style={styles.progressdoneArea}>
            {eventItem !== '' ? <CloseButton /> : null}
            <View style={styles.containerArea}>
              {eventItem === '미민크루'
                ? rednerMeminCrew()
                : eventItem === '꽝'
                ? renderBlank()
                : renderBlank()}
            </View>
            {eventItem === '미민크루' ? (
              <TouchableOpacity style={styles.button} onPress={goToKakao}>
                <Text style={styles.buttonText}>
                  Go to Memint Kakao Channel
                </Text>
              </TouchableOpacity>
            ) : eventItem === '꽝' ? (
              <TouchableOpacity
                style={styles.button}
                onPress={goToMeetingConfirm}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={goToMeetingConfirm}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <LottieView
              source={celebrate}
              // source={require('../../assets/animations/celebrate.json')}
              progress={animationProgress.current}
            />
            <TouchableWithoutFeedback onPress={onEventHandler}>
              <View style={styles.progressArea}>
                <Text style={styles.textSub}>
                  Touch the random box to open it!
                </Text>
                <Animatable.Image
                  animation="swing"
                  iterationCount={3}
                  duration={0}
                  delay={100000000000}
                  ref={AnimationRef}
                  source={randomBox}
                  style={[styles.logo]}
                />
              </View>
            </TouchableWithoutFeedback>
            {/* </TouchableOpacity> */}
          </>
        )}
        {/* </View> */}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  nftImg: {
    width: 200,
    height: 200,
    borderColor: '#AEFFC1',
    borderWidth: 3,
    borderRadius: 999,
    marginBottom: 15,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  fullscreen: {
    flex: 1,
  },

  text: {
    marginLeft: 10,
    fontSize: 20,
  },

  textSub: {
    paddingHorizontal: 6,
    fontWeight: '400',
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    marginBottom: 30,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  grayTitle: {
    color: '#B9C5D1',
    marginBottom: 20,
    fontSize: 12,
  },
  grayContent: {
    color: '#B9C5D1',
    fontSize: 12,
  },

  textSubContent: {
    margin: 8,
    color: '#ffffff',
    fontSize: 18,
  },

  tagsContainer: {
    flexWrap: 'wrap',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 14,
  },

  button: {
    position: 'absolute',
    bottom: 20,
    // marginTop: 'auto',
    // marginBottom: 30,
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
  eventNotiTitle: {
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 15,
    marginVertical: 20,
    color: '#1D1E1E',
  },
  eventNotiDesc: {
    marginVertical: 20,
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: '400',
    letterSpacing: -0.5,
    color: '#1D1E1E',
  },
  eventNotiText: {
    color: '#1D1E1E',
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: -0.5,
  },
  meetingTitle: {
    // fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#1D1E1E',
    // lineHeight: 140,
    // marginTop: 5,
  },
  meetingTime: {
    backgroundColor: '#1D1E1E',
    fontWeight: '400',
    fontSize: 12,
    color: '#B9C5D1',
    margin: 15,
  },
  eventTitle: {
    marginTop: 35,
    alignItems: 'center',
  },
  eventResult: {
    marginTop: 2,
    color: '#1D1E1E',
  },
  popperArea: {alignItems: 'center'},
  bombArea: {alignItems: 'center', marginTop: 70},
  descriptionArea: {padding: 25},
  containerArea: {
    // position: 'absolute',
    width: '100%',
    height: '78%',
    marginBottom: 60,
    // left: 16,
    // top: 54,

    /* 5 */
    backgroundColor: '#FFFFFF',
    /* B5 */
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#AEFFC1',
    borderRadius: 15,
  },
  progressdoneArea: {
    // marginTop: 120,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    // box-sizing: border-box;
  },
  progressArea: {
    // marginTop: 200,
    activeOpacity: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  partyPopper: {
    width: 148,
    height: 148,
  },
});

export default EventPage;
