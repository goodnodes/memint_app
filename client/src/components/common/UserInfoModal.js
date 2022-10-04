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
import {handleBirth} from '../../utils/common/Functions';

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
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.images}
                      onPress={() => {
                        visible === false
                          ? setAskSpendingModalVisible(true)
                          : null;
                      }}>
                      <View style={styles.imageLarge}>
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
                    <View
                      style={{justifyContent: 'space-around', width: '58%'}}>
                      <View style={styles.userinfo}>
                        <Text style={styles.userinfoKey}>닉네임</Text>
                        <Text style={styles.userinfoValue}>
                          {user.nickName} {user.property.emoji}
                        </Text>
                      </View>
                      <View style={styles.userinfo}>
                        <Text style={styles.userinfoKey}>나이</Text>
                        <Text style={styles.userinfoValue}>
                          {handleBirth(user.birth)}
                        </Text>
                      </View>
                      <View style={styles.userinfo}>
                        <Text style={styles.userinfoKey}>성별</Text>
                        <Text style={styles.userinfoValue}>{user.gender}</Text>
                      </View>
                    </View>
                  </View>
                  <ScrollView style={styles.usertag}>
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
                      <Text style={styles.hilightText}>주출몰지</Text>
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
                      <Text style={styles.hilightText}>유튜브</Text>
                      <View style={styles.tags}>
                        <View style={styles.plainTag}>
                          <Text style={styles.tagText}>
                            {user.property.favYoutube}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.tagRow}>
                      <Text style={styles.hilightText}>닮은꼴</Text>
                      <View style={styles.tags}>
                        <View style={styles.plainTag}>
                          <Text style={styles.tagText}>
                            {user.property.twinCeleb}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.tagRow}>
                      <Text style={styles.hilightText}>주량</Text>
                      <View style={styles.tags}>
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>
                            {user.property.drinkCapa}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.tagRow}>
                      <Text style={styles.hilightText}>선호 주류</Text>
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
                      <Text style={styles.hilightText}>술자리</Text>
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
                      <Text style={styles.hilightText}>통금</Text>
                      <View style={styles.tags}>
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>
                            {user.property.curfew}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.tagRow}>
                      <Text style={styles.hilightText}>주력 게임</Text>
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
                      text="확인"
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
          nButtonText="아니오"
          pButtonText="네"
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
            setSpendingModalVisible(false);
            addVisibleUser(owner.id, userId)
              .then(() => {
                saveInfo({
                  ...owner,
                  visibleUser: [...owner.visibleUser, userId],
                  tokenAmount:
                    owner.tokenAmount - 1 / owner.meminStats.HumanElement,
                });
              })
              .then(() => {
                console.log(owner);
              });
          }}
          amount={(5 / owner.meminStats.HumanElement).toFixed(1)} // Human Element에 용감함 지수 곱해주는 로직 추가해줘야함
          txType="프로필 조회"
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  buttonRow: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingTop: 10,
  },
  images: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  imageLarge: {
    position: 'absolute',
    height: 80,
    width: 80,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#58FF7D',
  },
  imageSmall: {
    height: 30,
    width: 30,
    borderRadius: 15,
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
  userinfo: {
    flexDirection: 'row',
  },
  userinfoKey: {
    color: '#B9C5D1',
    width: 55,
  },
  userinfoValue: {
    color: '#000000',
  },
  usertag: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 20,
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
});
export default UserInfoModal;
