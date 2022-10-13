import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Linking,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {prepare, request, getResult} from 'klip-sdk';
import Clipboard from '@react-native-clipboard/clipboard';
import WalletAccountElement from '../../components/walletComponents/WalletAccountElement';
import WalletKlayHistory from '../../components/walletComponents/WalletKlayHistory';
import WalletLcnHistory from '../../components/walletComponents/WalletLcnHistory';
import SingleModal from '../../components/common/SingleModal';
import DoubleModal from '../../components/common/DoubleModal';
import WalletCustomModal from '../../components/walletComponents/WalletCustomModal';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import klayIcon from '../../assets/icons/klaytn-klay-logo.png';
import tingsymbol from '../../assets/icons/tingsymbol.png';
import klipIcon from '../../assets/icons/klip.png';
import BasicButton from '../../components/common/BasicButton';
import axios from 'axios';
import {getBalance} from '../../lib/api/wallet';
import {getUser} from '../../lib/Users';
import {getOnchainKlayLog} from '../../lib/OnchainKlayLog';
import {getOnchainTokenLog} from '../../lib/OnchainTokenLog';
import useOnchainActions from '../../utils/hooks/UseOnchainActions';
import useAuthActions from '../../utils/hooks/UseAuthActions';
const WalletOnchainMain = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('account');
  const [refreshing, setRefreshing] = useState(false);
  const {addKlayLog, addLcnLog} = useOnchainActions();
  const {updateTokenInfo} = useAuthActions();
  const {showToast} = useToast();
  const userInfo = useUser();
  // const slicedAddress = userInfo.address
  //   ? `${userInfo.address.substr(0, 15)}....${userInfo.address.substr(30)}`
  //   : null;
  // Connect Klip Wallet Start
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // const balance = await getBalance(userInfo.address);
    await getBalance(userInfo.id, userInfo.address).then(result => {
      if (result.message === 'success') {
        getUser(userInfo.id).then(userDetail => {
          updateTokenInfo({
            tokenAmount: Number(userDetail.tokenAmount),
            klayAmount: Number(result.KlayBalance),
            onChainTokenAmount: Number(userDetail.onChainTokenAmount),
          });
          getOnchainKlayLog(userInfo.id).then(res => {
            const logs = res.docs.map(el => {
              return {...el.data()};
            });
            addKlayLog(logs);
          });
          getOnchainTokenLog(userInfo.id).then(res => {
            const logs = res.docs.map(el => {
              return {...el.data()};
            });
            addLcnLog(logs);
          });
        });
      }
    });

    setRefreshing(false);
  }, [userInfo]);
  const slicedAddress = `${userInfo.address.substr(
    0,
    15,
  )}....${userInfo.address.substr(30)}`;
  const goToOnchainTrade = () => {
    navigation.navigate('WalletOnchainTrade');
  };
  const imgSrc =
    currentTab === 'KLAY'
      ? klayIcon
      : currentTab === 'LCN'
      ? tingsymbol
      : klayIcon;
  const ticker =
    currentTab === 'KLAY' ? 'KLAY' : currentTab === 'LCN' ? 'LCN' : 'KLAY';
  const currentBalance =
    currentTab === 'KLAY'
      ? Math.round((userInfo.klayAmount + Number.EPSILON) * 10000) / 10000
      : currentTab === 'LCN'
      ? Math.round((userInfo.onChainTokenAmount + Number.EPSILON) * 10000) /
        10000
      : Math.round((userInfo.klayAmount + Number.EPSILON) * 10000) / 10000;
  const copyToClipboard = text => {
    Clipboard.setString(text);
  };

  // useEffect(() => {
  //   setAlarmModalVisible(true);
  // }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log('pressed');
        setModalVisible(false);
        setTransferModalVisible(false);
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View>
          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <TouchableOpacity>
                <Image source={imgSrc} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.balanceText}>
                {currentBalance} {ticker}
              </Text>
            </View>
            <View style={styles.address}>
              <Text style={styles.addressText}>{slicedAddress}</Text>
            </View>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <Image
                    style={styles.icon}
                    source={require('../../assets/icons/receive.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.plainText}>Receive</Text>
              </View>
              <View style={styles.iconWrapper}>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => {
                    setTransferModalVisible(true);
                  }}>
                  <Image
                    style={styles.icon}
                    source={require('../../assets/icons/money-transfer.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.plainText}>Transfer</Text>
              </View>
              <View style={styles.iconWrapper}>
                <TouchableOpacity
                  style={styles.iconCircle}
                  // onPress={goToOnchainTrade}
                  onPress={() => {
                    showToast('basic', 'Coming Soon');
                  }}>
                  <Image
                    style={styles.icon}
                    source={require('../../assets/icons/transfer.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.plainText}>Trade</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentTab('account')}>
              <Text style={styles.walletText}>Wallet Account</Text>
            </TouchableOpacity>
            {currentTab === 'KLAY' ? (
              <View style={styles.contentContainer}>
                <WalletKlayHistory />
              </View>
            ) : currentTab === 'TING' ? (
              <WalletLcnHistory />
            ) : (
              <View style={styles.contentContainer}>
                <WalletAccountElement
                  content="KLAY"
                  balance={
                    Math.round((userInfo.klayAmount + Number.EPSILON) * 10000) /
                    10000
                  }
                  onPress={setCurrentTab}
                />
                <WalletAccountElement
                  content="TING"
                  balance={
                    Math.round(
                      (userInfo.onChainTokenAmount + Number.EPSILON) * 10000,
                    ) / 10000
                  }
                  onPress={setCurrentTab}
                />
              </View>
            )}
          </View>

          {modalVisible ? (
            <View style={styles.centeredView}>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <View style={[styles.centeredView, styles.backgroudDim]}>
                    <View style={styles.recieveModalView}>
                      <Text style={styles.modalText}>Receive KLAY</Text>
                      <View style={styles.address}>
                        <Text style={styles.addressText}>{slicedAddress}</Text>
                      </View>
                      <View style={styles.buttonColumn}>
                        <BasicButton
                          text={'Copy address'}
                          textSize={16}
                          width={140}
                          height={55}
                          backgroundColor="#AEFFC1"
                          textColor="black"
                          onPress={() => {
                            setModalVisible(false);
                            copyToClipboard(userInfo.address);
                            showToast('success', 'Copied');
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setModalVisible(() => false);
                            navigation.navigate('WalletOnchainRecieve');
                          }}
                          disabled={false}>
                          <View style={styles.klipButton}>
                            <Image source={klipIcon} style={styles.klipIcon} />
                            <Text style={[styles.klipText]}>
                              {`Receive${'\n'}from Klip`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          ) : null}
          {/* <DoubleModal
          text="Recieve KLAY"
          nButtonText="주소 복사하기"
          pButtonText={`Klip에서\n가져오기`}
          body={
            <View style={styles.address}>
              <Text style={styles.addressText}>{slicedAddress}</Text>
            </View>
          }
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          nFunction={() => {
            setModalVisible(false);
            copyToClipboard(userInfo.address);
            showToast('success', '주소가 복사되었습니다!');
          }}
          pFunction={() => {
            setModalVisible(false);
          }}
        /> */}
          <WalletCustomModal
            modalVisible={transferModalVisible}
            setModalVisible={setTransferModalVisible}
            nFunction={() => {
              setTransferModalVisible(false);
              navigation.navigate('WalletKlayTransfer');
            }}
            pFunction={() => {
              showToast('basic', 'Coming Soon');

              // setTransferModalVisible(false);
              // navigation.navigate('WalletLcnTransfer');
            }}
          />
          {/*알림 모달 */}
          {alarmModalVisible ? (
            <View style={styles.centeredView}>
              <Modal
                animationType="fade"
                transparent={true}
                visible={alarmModalVisible}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setAlarmModalVisible(false);
                  }}>
                  <View style={[styles.centeredView, styles.backgroudDim]}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>
                        MEMINT WALLET 내 모든 거래는 Baobab Test Network 상에서
                        이루어집니다.
                        {/* MEMINT 지갑 내 모든 거래는{'\n'}Baobab Test Network 상에서{'\n'}이루어집니다. */}
                      </Text>
                      <Text style={styles.subText}>
                        ※ 실제 가상 자산 거래가 이루어지지 않습니다.
                      </Text>
                      <View style={styles.buttonRow}>
                        <BasicButton
                          text={'확인'}
                          textSize={16}
                          width={120}
                          height={45}
                          backgroundColor="#AEFFC1"
                          textColor="black"
                          onPress={() => {
                            setAlarmModalVisible(false);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 8,
    // marginTop: 80,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    // flex: 1,
    // marginTop: 50,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    justifyContent: 'center',
    borderColor: 'black',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 999,
    margin: 5,
    width: 122,
    height: 38,
    marginBottom: 20,
  },
  iconWrapper: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 30,
    marginBottom: 30,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  address: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 270,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  iconCircle: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: 10,
  },
  icon: {
    width: 35,
    height: 35,
    paddingTop: 20,
  },
  klipIcon: {
    width: 35,
    height: 35,
  },
  balanceText: {
    fontSize: 36,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    letterSpacing: -0.5,
    color: '#000000',
  },
  walletText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.5,
    color: '#000000',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -100,
  },
  modalView: {
    width: 330,
    height: 280,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
    borderColor: '#AEFFC1',
    borderWidth: 1,
    zIndex: -1,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  recieveModalView: {
    width: 330,
    height: 230,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderColor: '#AEFFC1',
    borderWidth: 1,
    zIndex: -1,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  modalText: {
    fontWeight: '500',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 25.2,
    fontSize: 18,
    color: '#1D1E1E',
    letterSpacing: -0.5,
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  subText: {
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
    color: '#1D1E1E',
  },
  buttonRow: {
    marginTop: 'auto',
  },
  buttonColumn: {
    flexDirection: 'row',
    marginTop: 20,
  },
  klipButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    width: 140,
    height: 55,
    backgroundColor: '#AEFFC1',
    textColor: 'black',
    text: '버튼',
    textSize: 14,
    borderRadius: 30,
    border: true,
    disabled: false,
    borderWidth: 1,
    borderColor: '#AEFFC1',
  },
  klipText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addressText: {
    color: '#1D1E1E',
  },
  plainText: {
    color: '#000000',
  },
});

export default WalletOnchainMain;
