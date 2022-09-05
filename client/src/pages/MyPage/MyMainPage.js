import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MyMeetingList from '../../components/myPageComponent/MyMeetingList';
import ParticipatedMeetingList from '../../components/myPageComponent/ParticipatedMeetingList';
import WalletButton from '../../components/common/WalletButton';
import * as Progress from 'react-native-progress';
import dinoegg from '../../assets/icons/dinoegg.png';
import dummyDino from '../../assets/icons/dummyCharacter.png';
import BasicButton from '../../components/common/BasicButton';
import likesActive from '../../assets/icons/likesActive.png';
import eggS from '../../assets/icons/eggS.png';
import eggD from '../../assets/icons/eggD.png';
import eggB from '../../assets/icons/eggB.png';
import MyEggModal from '../../components/myPageComponent/MyEggModal';
import useUser from '../../utils/hooks/UseUser';
import LinearGradient from 'react-native-linear-gradient';
import BottomDrawer from '../../components/myPageComponent/BottomDrawer';

function MyMainPage({navigation}) {
  // const user = useUser();
  const userInfo = useUser();
  const meminStats = userInfo.meminStats;
  // useEffect(() => {
  //   console.log(meminStats);
  // });
  const {top} = useSafeAreaInsets();
  // const animation = useRef(new Animated.Value(1)).current;
  const [meetingRoom, setMeetingRoom] = useState(0);
  const [tabActive, setTabActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const room = [{name: '내가 만든 방'}, {name: '참여 중인 방'}];
  const selecteMenuHandler = index => {
    setMeetingRoom(index);
  };
  const handleNavigate = () => {
    navigation.navigate('MyPage');
  };
  const handleLikesNavigate = () => {
    navigation.navigate('MyLikesRooms');
  };

  const handleMyEgg = () => {
    setModalVisible(true);
  };

  // useEffect(() => {
  //   Animated.spring(animation, {
  //     toValue: tabActive ? windowHeight / 4 : windowHeight / 1.25,
  //     useNativeDriver: true,
  //     speed: 10,
  //     bounciness: 1,
  //   }).start();
  // }, [tabActive, animation]);

  return (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="dark-content" />

      <View style={{backgroundColor: '#82EFC1', height: top}} />

      {/* <TouchableWithoutFeedback
        onPress={() => {
          if (tabActive) {
            setTabActive(false);
          }
        }}> */}
      <LinearGradient
        colors={['#82EFC1', '#ffffff']}
        start={{x: 0.5, y: 0.4}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <ScrollView
          style={styles.myCharacterView}
          contentContainerStyle={styles.paddingBottom}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleNavigate}>
              <Image
                source={{uri: userInfo?.picture}}
                style={styles.pictureImage}
              />
            </TouchableOpacity>

            <WalletButton />
          </View>
          <View style={styles.character}>
            <View style={styles.characterWrap}>
              <Progress.Circle
                size={240}
                progress={0.3}
                color={'#2ACFC2'}
                unfilledColor={'#edeef6'}
                borderWidth={0}
                thickness={5}
              />
              <Image source={dummyDino} style={styles.characterImage} />
              <TouchableOpacity onPress={handleMyEgg} style={styles.eggView}>
                <Image source={dinoegg} style={styles.bigEggImage} />
              </TouchableOpacity>
              <MyEggModal
                buttonText="네"
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
              />
            </View>
            <Text style={styles.nickName}>{userInfo?.nickName}</Text>
            <View style={styles.characterDes}>
              <View
                style={[styles.colorCircle, {backgroundColor: '#FFAEF1'}]}
              />
              <Text style={styles.characterText}>티라노사우르스</Text>
            </View>
            <View style={styles.characterStatus}>
              <View>
                <Progress.Circle
                  size={49}
                  progress={0.5}
                  color={'#2ACFC2'}
                  unfilledColor={'#ffffff'}
                  borderWidth={0}
                  thickness={5}
                />
                <Progress.Circle
                  size={49}
                  progress={0.5}
                  color={'#2ACFC2'}
                  unfilledColor={'#ffffff'}
                  borderWidth={0}
                  thickness={5}
                />
              </View>
              <View style={styles.status}>
                <Image source={eggS} style={styles.eggImage} />
                <Progress.Bar
                  width={310}
                  height={18}
                  progress={0.5}
                  color={'#2ACFC2'}
                  unfilledColor={'#EDEEF6'}
                  borderRadius={999}
                  style={styles.progressBar}>
                  <Text style={styles.statusText}>50 / 100</Text>
                </Progress.Bar>
              </View>
              <View style={styles.status}>
                <Image source={eggD} style={styles.eggImage} />
                <Progress.Bar
                  width={310}
                  height={18}
                  progress={0.5}
                  color={'#4E00F5'}
                  unfilledColor={'#EDEEF6'}
                  borderRadius={999}
                  style={styles.progressBar}>
                  <Text style={styles.statusText}>{50} / 100</Text>
                </Progress.Bar>
              </View>
              <View style={styles.status}>
                <Image source={eggB} style={styles.eggImage} />
                <Progress.Bar
                  width={310}
                  height={18}
                  progress={0.5}
                  color={'#CFAB2A'}
                  unfilledColor={'#EDEEF6'}
                  borderRadius={999}
                  style={styles.progressBar}>
                  <Text style={styles.statusText}>50 / 100</Text>
                </Progress.Bar>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      {/* </TouchableWithoutFeedback> */}
      <BottomDrawer
        onDrawerStateChange={() => {
          setTabActive(!tabActive);
        }}>
        {/* 찜한 미팅방 */}
        <View style={styles.mylikes}>
          <TouchableOpacity
            style={styles.mylikesButton}
            onPress={handleLikesNavigate}>
            <Text style={styles.mylikesText}>내가 찜한 미팅</Text>
            <Image source={likesActive} style={styles.likesfootImage} />
          </TouchableOpacity>
        </View>
        {!tabActive ? (
          <></>
        ) : (
          <>
            {/* 탭 선택 버튼 */}
            <View style={styles.meetingButton}>
              {room.map((ele, index, key) => {
                return (
                  <BasicButton
                    text={ele.name}
                    width={160}
                    height={40}
                    textSize={16}
                    backgroundColor={
                      meetingRoom === index ? '#AEFFC0' : 'transparent'
                    }
                    textColor={meetingRoom === index ? 'black' : 'white'}
                    borderRadius={30}
                    border={meetingRoom === index ? true : false}
                    margin={[10, 3, 3, 3]}
                    onPress={() => selecteMenuHandler(index)}
                    key={index}
                  />
                );
              })}
            </View>
            {/* 탭 선택에 따른 미팅 리스트 */}

            {meetingRoom === 0 ? (
              <MyMeetingList navigation={navigation} user={userInfo} />
            ) : (
              <ParticipatedMeetingList user={userInfo} />
            )}
          </>
        )}
      </BottomDrawer>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#82EFC1',
  },
  myCharacterView: {
    flex: 1,
    paddingHorizontal: 15,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
  },
  gradientBackground: {
    flex: 1,
  },
  character: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  characterWrap: {
    marginTop: 32,
    marginBottom: 12,
  },
  characterImage: {
    position: 'absolute',
    width: 230,
    height: 230,
    zIndex: -4,
    left: 5,
    top: 5,
  },
  characterDes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  characterText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.5,
    lineHeight: 16.8,
    color: '#3C3D43',
  },
  characterStatus: {
    paddingHorizontal: 15,
    marginTop: 42,
  },
  nickName: {
    fontFamily: 'NeoDunggeunmoPro-Regular',
    fontSize: 20,
    color: '#1D1E1E',
    letterSpacing: -0.5,
    marginBottom: 4,
    lineHeight: 20 * 1.4,
  },
  mymeetingTab: {
    backgroundColor: '#3C3D43',
    width: '100%',
    height: '20%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  pictureImage: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  footImage: {
    width: 24.46,
    height: 21.75,
    marginRight: 8,
    tintColor: '#2ACFC2',
  },
  eggView: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 8,
    right: 12,
  },
  bigEggImage: {
    width: 21.56,
    height: 29,
    borderRadius: 999,
  },
  eggImage: {
    width: 21.56,
    height: 29,
    marginLeft: 20,
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 6,
  },
  statusBackground: {
    backgroundColor: '#EDEEF6',
    width: '100%',
    height: 20,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#B9C5D1',
    zIndex: -1,
  },
  progressBar: {
    marginLeft: 8,
  },
  statusBar: {
    width: '72.8%',
    height: 20,
    backgroundColor: '#2ACFC2',
    borderWidth: 1.5,
    borderColor: '#2ACFC2',

    paddingLeft: 11,
    borderRadius: 3,
    zIndex: 1,
    position: 'absolute',
    top: -0.5,
    left: -0.5,
    justifyContent: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    letterSpacing: -1.9,
    position: 'absolute',
    left: 10,
    top: 2,
    fontFamily: 'Silkscreen',
  },
  paddingBottom: {
    paddingBottom: 150,
  },
  centeredView: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  tabView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 25,
    alignItems: 'center',
    borderColor: '#AEFFC1',
    borderWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  mylikesButton: {
    flexDirection: 'row',
    width: 118,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mylikesText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: '#ffffff',
  },
  mylikes: {
    marginTop: 23,
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  meetingButton: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likesfootImage: {
    width: 30,
    height: 30,
    tintColor: '#33ED96',
    marginLeft: 5,
  },
  flex: {
    flex: 1,
  },
  colorCircle: {
    width: 15,
    height: 15,
    borderRadius: 999,
    marginRight: 8,
  },
});

export default MyMainPage;
