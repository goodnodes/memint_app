import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MyMeetingList from '../../components/myPageComponent/MyMeetingList';
import ParticipatedMeetingList from '../../components/myPageComponent/ParticipatedMeetingList';
import WalletButton from '../../components/common/WalletButton';
import * as Progress from 'react-native-progress';
import dinoegg from '../../assets/icons/dinoegg.png';
import BasicButton from '../../components/common/BasicButton';
import likespink from '../../assets/icons/likespink.png';
import eggS from '../../assets/icons/eggS.png';
import eggD from '../../assets/icons/eggD.png';
import eggB from '../../assets/icons/eggB.png';
import MyEggModal from '../../components/myPageComponent/MyEggModal';
import useUser from '../../utils/hooks/UseUser';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import BottomDrawer from '../../components/myPageComponent/BottomDrawer';
import {getDino} from '../../components/myPageComponent/MeminStats';
import {useIsFocused} from '@react-navigation/native';
import {rechargeEnergy} from '../../lib/NFT';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import littledino from '../../assets/icons/littledino.png';
import DoubleModal from '../../components/common/DoubleModal';
import SpendingModal from '../../components/common/UserInfoModal/SpendingModal';
import {chargeEnergy} from '../../lib/NFT';
import {useToast} from '../../utils/hooks/useToast';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

const {width} = Dimensions.get('window');

function MyMainPage({navigation}) {
  // const user = useUser();
  const userInfo = useUser();
  const {saveInfo} = useAuthActions();
  const [rechargeCheck, setRechargeCheck] = useState(false);
  const [meminStats, setMeminStats] = useState('');
  const [chargeModalVisible, setChargeModalVisible] = useState(false);
  const [spendingModalVisible, setSpendingModalVisible] = useState(false);
  const {showToast} = useToast();

  useEffect(() => {
    if (userInfo) {
      console.log(userInfo);
      if (
        Number(userInfo.meminStats.energyRechargeTime) + 86400 <=
        Number(String(Date.now()).slice(0, 10))
      ) {
        console.log('hi');
        rechargeEnergy(userInfo, Number(String(Date.now()).slice(0, 10))).then(
          amount => {
            console.log(amount);
            saveInfo({
              ...userInfo,
              meminStats: {
                ...userInfo.meminStats,
                energy: userInfo.meminStats.energy + amount,
                energyRechargeTime: Number(String(Date.now()).slice(0, 10)),
              },
            });
          },
        );
      }
      setMeminStats(userInfo.meminStats);
      getDino(userInfo.meminStats, setMeminStats);
    }
  }, [rechargeCheck]);

  //Number(String(Date.now()).slice(0, 10)),

  useEffect(() => {
    if (userInfo) {
      //   console.log(userInfo);
      //   if (
      //     Number(userInfo.meminStats.energyRechargeTime) + 86400 <=
      //     Number(String(Date.now()).slice(0, 10))
      //   ) {
      //     console.log('hi');
      //     rechargeEnergy(userInfo, saveInfo);
      //   }
      setMeminStats(userInfo.meminStats);
      getDino(userInfo.meminStats, setMeminStats);
      setRechargeCheck(true);
    }
    if (meminStats) {
      console.log('good');
    }
  }, [userInfo]);
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
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor="#82EFC1"
        animated={true}
      />

      <View style={{backgroundColor: '#82EFC1', height: top}} />

      {/* <TouchableWithoutFeedback
        onPress={() => {
          if (tabActive) {
            setTabActive(false);
          }
        }}> */}
      <LinearGradient
        colors={['#82EFC1', '#ffffff']}
        start={{x: 1, y: 0.3}}
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

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                // style={styles.walletButton}
                onPress={() => {
                  setChargeModalVisible(true);
                }}>
                {/* <Text style={styles.buttonText}>Wallet</Text> */}
                <View style={styles.chargeEnergy}>
                  <Image source={littledino} style={styles.image} />
                  {meminStats && (
                    <Text
                      style={
                        styles.buttonText
                      }>{`${meminStats.energy} / ${meminStats.fullEnergy} +`}</Text>
                  )}
                </View>
              </TouchableOpacity>

              <WalletButton />

              <DoubleModal
                text={`토큰을 소모하여\n 에너지를 충전하시겠습니까?`}
                nButtonText="아니요"
                pButtonText="네"
                modalVisible={chargeModalVisible}
                setModalVisible={setChargeModalVisible}
                pFunction={() => {
                  if (meminStats.energy === meminStats.fullEnergy) {
                    setChargeModalVisible(false);
                    showToast('error', '에너지가 이미 가득 차있습니다.');
                  } else {
                    setChargeModalVisible(false);
                    setSpendingModalVisible(true);
                  }
                }}
                nFunction={() => {
                  setChargeModalVisible(false);
                }}
              />
              {userInfo && (
                <SpendingModal
                  spendingModalVisible={spendingModalVisible}
                  setSpendingModalVisible={setSpendingModalVisible}
                  pFunction={() => {
                    chargeEnergy(userInfo, meminStats.fullEnergy).then(num => {
                      saveInfo({
                        ...userInfo,
                        tokenAmount: userInfo.tokenAmount - 1,
                        meminStats: {
                          ...userInfo.meminStats,
                          energy: userInfo.meminStats.energy + num,
                        },
                      });
                      setSpendingModalVisible(false);
                    });
                  }}
                  amount={1}
                  txType="에너지 충전"
                />
              )}
            </View>
          </View>
          <View style={styles.character}>
            <View style={styles.characterWrap}>
              <Progress.Circle
                size={240}
                progress={
                  meminStats ? meminStats.energy / meminStats.fullEnergy : 0
                }
                color={'#2ACFC2'}
                unfilledColor={'#edeef6'}
                thickness={8}
                borderWidth={0}
              />
              <Image
                source={{uri: userInfo?.nftProfile}}
                style={styles.characterImage}
              />
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
              <Text style={styles.characterText}>{meminStats?.dinoType}</Text>
            </View>
            <View style={styles.characterStatus}>
              <View style={styles.levelRow}>
                <Progress.Circle
                  size={49}
                  progress={meminStats ? meminStats.exp / 5 : 0}
                  color={'#FFAEF1'}
                  unfilledColor={'#ffffff'}
                  borderWidth={0}
                  thickness={5}
                  style={styles.smallProgressCircle}
                  direction="counter-clockwise"
                  formatText={progress => {
                    return `LV.${meminStats?.level}`;
                  }}
                  showsText={true}
                  textStyle={{
                    color: '#000000',
                    fontFamily: 'Silkscreen',
                    fontSize: 12,
                    lineHeight: 12,
                    letterSpacing: -0.5,
                  }}
                />
                <View style={styles.gradeView}>
                  <Progress.Circle
                    size={49}
                    progress={meminStats ? meminStats.charm / 100 : 0}
                    color={'#FF9D9D'}
                    unfilledColor={'#ffffff'}
                    borderWidth={0}
                    thickness={5}
                    style={styles.smallProgressCircle}
                    direction="counter-clockwise"
                  />
                  <Image source={likespink} style={styles.gradeImage} />
                  <Text style={styles.gradeText}>{meminStats?.grade}</Text>
                </View>
              </View>
              <View style={styles.status}>
                <Image source={eggS} style={styles.eggImage} />
                <Progress.Bar
                  width={width * 0.8}
                  height={16}
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
                  width={width * 0.8}
                  height={16}
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
                  width={width * 0.8}
                  height={16}
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
            <Icon name="chevron-right" size={22} color={'#AEFFC1'} />
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
    width: 229,
    height: 229,
    zIndex: -4,
    left: 5.5,
    top: 5.5,
    borderRadius: 999,
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
    // paddingHorizontal: 15,
    width: '100%',
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
    width: '100%',
    height: 20,
    backgroundColor: '#2ACFC2',
    borderWidth: 1.5,
    borderColor: '#2ACFC2',

    paddingLeft: 5,
    borderRadius: 3,
    zIndex: 1,
    position: 'absolute',
    top: -0.5,
    left: -0.5,
    justifyContent: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    letterSpacing: -1.9,
    position: 'absolute',
    left: 10,
    top: 2,
    fontFamily: 'Silkscreen',
    lineHeight: 12,
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
    lineHeight: 22.4,
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
  gradeImage: {
    width: 28,
    height: 24,
    position: 'absolute',
    top: 12,
    left: 19.5,
  },
  gradeText: {
    color: '#C15D5D',
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: -0.5,
    fontFamily: 'Silkscreen',
    position: 'absolute',
    top: 19.5,
    left: 30,
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
  levelRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  smallProgressCircle: {
    marginHorizontal: 10,
  },
  chargeEnergy: {
    // position: 'absolute',
    // width: 60,
    paddingHorizontal: 8,
    height: 28,
    // left: 0,
    // top: 0,
    backgroundColor: '#3C3D43',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#58FF7D',
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: 10,
  },
  buttonText: {
    color: '#58FF7D',
    fontSize: 16,
    marginLeft: 4,
    letterSpacing: -0.5,
  },
  image: {
    width: 18,
    height: 18,
  },
});

export default MyMainPage;
