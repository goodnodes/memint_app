import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import BasicButton from './BasicButton';
import SpendingModal from './UserInfoModal/SpendingModal';
import AskSpendingModal from './UserInfoModal/AskSpendingModal';
import {ActivityIndicator} from 'react-native-paper';
import {getOtherUser} from '../../lib/Users';
import {addVisibleUser} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import likespink from '../../assets/icons/likespink.png';
import {handleBirth} from '../../utils/common/Functions';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';

/*
사용할 컴포넌트에서 state 사용이 필요함.
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);

      <UserInfoModal
      userId=
        userInfoModalVisible={userInfoModalVisible}
        setUserInfoModalVisible={setUserInfoModalVisible}
        pFunction={() => {}}
        visible=
      />
 */
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function UserInfoModal({
  userId,
  userInfoModalVisible,
  setUserInfoModalVisible,
  visible,
}) {
  const {saveInfo} = useAuthActions();
  const owner = useUser();
  const [spendingModalVisible, setSpendingModalVisible] = useState(false);
  const [askSpendingModalVisible, setAskSpendingModalVisible] = useState(false);
  const [user, setUser] = useState('');
  const [bigPicture, setBicPicture] = useState(false);

  useEffect(() => {
    getOtherUser(userId).then(result => {
      setUser(result);
    });
  }, [userId, visible]);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={userInfoModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalViewContainer}>
            <View style={styles.closeRow}>
              <TouchableOpacity
                onPress={() => {
                  setUserInfoModalVisible(false);
                }}>
                <Icon
                  name="close"
                  size={24}
                  color={'#ffffff'}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modalView}>
              {user ? (
                <View style={styles.userInfoWrapper}>
                  <View style={styles.infoRow}>
                    <View style={styles.userArea}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          if (userId === owner.id) {
                            return;
                          } else {
                            if (!visible) {
                              setAskSpendingModalVisible(true);
                            }
                          }
                        }}>
                        <View>
                          <Image
                            style={styles.imageLarge}
                            source={{uri: user.nftProfile}}
                          />
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                              setBicPicture(true);
                            }}>
                            <Image
                              source={{uri: user.picture}}
                              style={
                                visible
                                  ? styles.imageSmall
                                  : {...styles.imageSmall, height: 0, width: 0}
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.userInfos}>
                        <Text style={styles.userinfoValue}>
                          {user.nickName} {user.property.emoji}
                        </Text>
                        <View style={styles.userinfo}>
                          <Text style={styles.userinfoValuePlain}>
                            {user.gender === '남자' ? 'Male' : 'Female'}
                          </Text>
                          <Text style={styles.userinfoValuePlain}>
                            {handleBirth(user.birth)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.meminStats}>
                      <View style={styles.levelRow}>
                        <Progress.Circle
                          size={41.5}
                          progress={
                            user.meminStats ? user.meminStats.exp / 5 : 0
                          }
                          color={'#FFAEF1'}
                          unfilledColor={'#edeef6'}
                          borderWidth={0}
                          thickness={5}
                          direction="counter-clockwise"
                          formatText={progress => {
                            return `LV.${user.meminStats?.level}`;
                          }}
                          showsText={true}
                          textStyle={{
                            color: '#000000',
                            fontFamily: 'Silkscreen',
                            fontSize: 10,
                            lineHeight: 12,
                            letterSpacing: -0.5,
                          }}
                        />
                        <View style={styles.gradeView}>
                          <Progress.Circle
                            size={41.5}
                            progress={
                              user.meminStats ? user.meminStats.charm / 100 : 0
                            }
                            color={'#FF9D9D'}
                            unfilledColor={'#edeef6'}
                            borderWidth={0}
                            thickness={5}
                            style={styles.smallProgressCircle}
                            direction="counter-clockwise"
                          />
                          <Image source={likespink} style={styles.gradeImage} />
                          <Text
                            style={[
                              styles.gradeText,
                              user && user.meminStats?.grade.length > 1
                                ? styles.gradeTextNew
                                : null,
                            ]}>
                            {user.meminStats?.grade}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.scrollContainer}>
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 1)',
                      ]}
                      start={{x: 1, y: 1}}
                      end={{x: 1, y: 0}}
                      style={styles.gradientTop}
                    />
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0)',
                        'rgba(255, 255, 255, 1)',
                      ]}
                      start={{x: 1, y: 0}}
                      end={{x: 1, y: 1}}
                      style={styles.gradientBottom}
                    />
                    <ScrollView
                      style={styles.usertag}
                      contentContainerStyle={styles.contentContainerStyle}
                      indicatorStyle="white">
                      <View style={styles.tagRow}>
                        <Text style={styles.hilightText}>MBTI</Text>
                        <View style={styles.tags}>
                          <View style={styles.tag}>
                            <Text style={styles.tagText}>
                              {user.property.mbti}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.tagRow}>
                        <Text style={styles.hilightText}>Favorite Place</Text>
                        <View style={styles.tags}>
                          {user ? (
                            user.property.region.map((ele, index) => {
                              return (
                                <View style={styles.tag} key={index}>
                                  <Text style={styles.tagText}>{ele}</Text>
                                </View>
                              );
                            })
                          ) : (
                            <ActivityIndicator size="large" color="#AEFFC1" />
                          )}
                        </View>
                      </View>
                      <View style={styles.tagRow}>
                        <Text style={styles.hilightText}>Favorite Channel</Text>
                        <View style={styles.tags}>
                          <View style={styles.plainTag}>
                            <Text style={styles.tagText}>
                              {user.property.favYoutube}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.tagRow}>
                        <Text style={styles.hilightText}>Twin Celebrity</Text>
                        <View style={styles.tags}>
                          <View style={styles.plainTag}>
                            <Text style={styles.tagText}>
                              {user.property.twinCeleb}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.tagRow}>
                        <Text style={styles.hilightText}>Drink</Text>
                        <View style={styles.tags}>
                          <View style={styles.tag}>
                            <Text style={styles.tagText}>
                              {user.property.drinkCapa}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.tagRow}>
                        <Text style={styles.hilightText}>Favorite Liquor</Text>
                        <View style={styles.tags}>
                          {user ? (
                            user.property.alcoholType.map((ele, index) => {
                              return (
                                <View style={styles.tag} key={index}>
                                  <Text style={styles.tagText}>{ele}</Text>
                                </View>
                              );
                            })
                          ) : (
                            <ActivityIndicator size="large" color="#AEFFC1" />
                          )}
                        </View>
                      </View>

                      <View style={styles.tagRow}>
                        <Text style={styles.hilightText}>Party Style</Text>
                        <View style={styles.tags}>
                          {user.property.drinkStyle.map((ele, index) => {
                            return (
                              <View style={styles.tag} key={index}>
                                <Text style={styles.tagText}>{ele}</Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                      <View style={styles.tagRow}>
                        <Text style={styles.hilightText}>Curfew</Text>
                        <View style={styles.tags}>
                          <View style={styles.tag}>
                            <Text style={styles.tagText}>
                              {user.property.curfew}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.tagRow}>
                        <Text style={styles.hilightText}>Favorite Game</Text>
                        <View style={styles.tags}>
                          {user ? (
                            user.property.favGame.map((ele, index) => {
                              return (
                                <View style={styles.tag} key={index}>
                                  <Text style={styles.tagText}>{ele}</Text>
                                </View>
                              );
                            })
                          ) : (
                            <ActivityIndicator size="large" color="#AEFFC1" />
                          )}
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                  {bigPicture && (
                    <View style={styles.pictureView}>
                      <Modal
                        animationType="fade"
                        transparent={true}
                        visible={bigPicture}>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                            setBicPicture(!bigPicture);
                          }}
                          style={styles.pictureModalView}>
                          <View style={styles.pictureCloseRow}>
                            <TouchableOpacity
                              onPress={() => {
                                setBicPicture(false);
                              }}>
                              <Icon
                                name="close"
                                size={24}
                                color={'#ffffff'}
                                style={styles.closeIcon}
                              />
                            </TouchableOpacity>
                          </View>
                          <Image
                            source={{uri: user.picture}}
                            style={styles.pictureImage}
                          />
                        </TouchableOpacity>
                      </Modal>
                    </View>
                  )}
                  <View style={styles.buttonRow}>
                    <BasicButton
                      text="Close"
                      width={width * 0.75}
                      height={50}
                      textSize={18}
                      variant="basic"
                      margin={[0, 0, 0, 0]}
                      onPress={() =>
                        setUserInfoModalVisible(!userInfoModalVisible)
                      }
                    />
                  </View>
                </View>
              ) : (
                <ActivityIndicator size="large" color="#AEFFC1" />
              )}
            </View>
          </View>
        </View>
        <AskSpendingModal
          nButtonText="No"
          pButtonText="Yes"
          askSpendingModalVisible={askSpendingModalVisible}
          setAskSpendingModalVisible={setAskSpendingModalVisible}
          amount={(5 / owner.meminStats.HumanElement).toFixed(1)}
          pFunction={() => {
            setAskSpendingModalVisible(false);
            setSpendingModalVisible(true);
          }}
        />
        <SpendingModal
          nButtonText="취소"
          pButtonText="확인"
          spendingModalVisible={spendingModalVisible}
          setSpendingModalVisible={setSpendingModalVisible}
          pFunction={() => {
            console.log(5 / owner.meminStats.HumanElement);
            setSpendingModalVisible(false);
            addVisibleUser(owner.id, userId)
              .then(() => {
                saveInfo({
                  ...owner,
                  visibleUser: [...owner.visibleUser, userId],
                  // tokenAmount:
                  //   owner.tokenAmount -
                  //   Math.round((5 / owner.meminStats.HumanElement) * 10) / 10,
                });
              })
              .then(() => {
                console.log(owner);
              });
          }}
          amount={Math.round((5 / owner.meminStats.HumanElement) * 10) / 10} // Human Element에 용감함 지수 곱해주는 로직 추가해줘야함
          txType="Check Profile"
        />
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalViewContainer: {
    position: 'absolute',
  },
  closeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeIcon: {
    paddingVertical: 15,
  },
  pictureCloseRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalView: {
    width: width * 0.925,
    height: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderColor: '#58FF7D',
    borderWidth: 1,
    paddingHorizontal: width * 0.09,
    paddingTop: 32,
    paddingBottom: 28,
    marginBottom: 30,
  },
  userInfoWrapper: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalText: {
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'center',
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  buttonRow: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  images: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  imageLarge: {
    // position: 'absolute',
    height: 59,
    width: 59,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#58FF7D',
  },
  imageSmall: {
    height: 32,
    width: 32,
    borderRadius: 15,
    position: 'absolute',
    bottom: -3,
    right: -3,
    shadowColor: '#FFFFFFBD',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.65,
    shadowRadius: 11.95,

    elevation: 18,
  },
  hilightText: {
    fontSize: 12,
    lineHeight: 16.8,
    letterSpacing: -0.5,
    color: '#B9C5D1',
    width: '17%',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    marginVertical: 5,
    zIndex: -10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '85%',
  },
  tag: {
    backgroundColor: '#EDEEF6',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 99,
    borderColor: 'transparent',
    borderWidth: 1,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  plainTag: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 99,
    borderColor: 'transparent',
    borderWidth: 1,
    marginHorizontal: 4,
  },
  userArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  userInfos: {marginLeft: 12},
  userinfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userinfoKey: {
    color: '#B9C5D1',
    width: 65,
  },
  userinfoValue: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22.4,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  userinfoValuePlain: {
    lineHeight: 19.6,
    letterSpacing: -0.5,
    marginRight: 8,
  },
  usertag: {
    width: '100%',
    flexDirection: 'column',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1D1E1E',
    lineHeight: 19.6,
  },
  pictureView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  pictureModalView: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width,
    height,
    flex: 1,
    backgroundColor: 'black',
  },
  pictureImage: {width: 400, height: 400, marginBottom: 30},
  contentContainerStyle: {paddingTop: 15, paddingBottom: 15},
  gradientBottom: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
  },
  gradientTop: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 40,
  },
  scrollContainer: {height: '76%', marginHorizontal: 0.2},
  gradeImage: {
    width: 23.71,
    height: 20.33,
    position: 'absolute',
    top: 10.5,
    left: 21.8,
  },
  gradeText: {
    color: '#C15D5D',
    fontSize: 13,
    lineHeight: 15,
    letterSpacing: -0.5,
    fontFamily: 'Silkscreen',
    position: 'absolute',
    top: 16.5,
    left: 30.7,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  smallProgressCircle: {
    marginLeft: 12,
  },
  gradeTextNew: {
    left: 20,
  },
});
export default UserInfoModal;
