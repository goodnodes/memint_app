import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import WalletAccountElement from '../../components/walletComponents/WalletAccountElement';
import WalletKlayHistory from '../../components/walletComponents/WalletKlayHistory';
import WalletLcnHistory from '../../components/walletComponents/WalletLcnHistory';
import SingleModal from '../../components/common/SingleModal';
import WalletCustomModal from '../../components/walletComponents/WalletCustomModal';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import klayIcon from '../../assets/icons/klaytn-klay-logo.png';
import lovechainIcon from '../../assets/icons/lovechain.png';
import BasicButton from '../../components/common/BasicButton';
const WalletOnchainMain = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);

  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('account');
  const {showToast} = useToast();
  const userInfo = useUser();
  // const slicedAddress = userInfo.address
  //   ? `${userInfo.address.substr(0, 15)}....${userInfo.address.substr(30)}`
  //   : null;
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
      ? lovechainIcon
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

  useEffect(() => {
    setAlarmModalVisible(true);
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log('pressed');
        setModalVisible(false);
        setTransferModalVisible(false);
      }}>
      <View>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Image source={imgSrc} style={styles.icon} />
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
              <Text>Receive</Text>
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
              <Text>Transfer</Text>
            </View>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                style={styles.iconCircle}
                // onPress={goToOnchainTrade}
                onPress={() => {
                  showToast(
                    'Coming soon',
                    '클로즈베타에서 지원하지 않는 기능입니다',
                  );
                }}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/icons/transfer.png')}
                />
              </TouchableOpacity>
              <Text>Trade</Text>
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

        <SingleModal
          text="Recieve KLAY"
          buttonText="주소 복사하기"
          body={
            <View style={styles.address}>
              <Text style={styles.addressText}>{slicedAddress}</Text>
            </View>
          }
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          pFunction={() => {
            setModalVisible(false);
            copyToClipboard(userInfo.address);
            showToast('success', '주소가 복사되었습니다!');
          }}
        />
        <WalletCustomModal
          modalVisible={transferModalVisible}
          setModalVisible={setTransferModalVisible}
          nFunction={() => {
            setTransferModalVisible(false);
            navigation.navigate('WalletKlayTransfer');
          }}
          pFunction={() => {
            setTransferModalVisible(false);
            navigation.navigate('WalletLcnTransfer');
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
    // backgroundColor: 'green',
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
  balanceText: {
    fontSize: 36,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    letterSpacing: -0.5,
  },
  walletText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.5,
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
  modalText: {
    fontWeight: '500',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 17,
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
});

export default WalletOnchainMain;
