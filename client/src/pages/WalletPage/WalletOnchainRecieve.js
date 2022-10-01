import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {prepare, request, getResult} from 'klip-sdk';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import DoubleModal from '../../components/common/DoubleModal';
import {useToast} from '../../utils/hooks/useToast';
import klayIcon from '../../assets/icons/klaytn-klay-logo.png';
import klipIcon from '../../assets/icons/klip.png';
import {transferKlay} from '../../lib/api/wallet';
import useUser from '../../utils/hooks/UseUser';
import {getUser} from '../../lib/Users';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {getOnchainKlayLog} from '../../lib/OnchainKlayLog';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useOnchainActions from '../../utils/hooks/UseOnchainActions';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const WalletOnchainRecieve = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {showToast} = useToast();
  const userInfo = useUser();
  const {updateTokenInfo} = useAuthActions();
  const {top} = useSafeAreaInsets();
  const {addKlayLog} = useOnchainActions();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    address: '',
    amount: '',
  });
  const createChangeTextHandler = name => value => {
    setForm({...form, [name]: value});
  };
  const onSubmit = () => {
    Keyboard.dismiss();
    console.log(form);
  };
  const recieveKlay = async () => {
    const bappName = 'memint';
    const successLink = '';
    const failLink = '';
    const to = userInfo.address;
    // const to = '0x8c0B2B16577777F7Ccb9818e6E7a88613E5633D5';
    const amount = form.amount;
    const res = await prepare.sendKLAY({
      bappName,
      to,
      amount,
      successLink,
      failLink,
    });
    console.log({res});
    if (res.err) {
      // 에러 처리
    } else if (res.request_key) {
      // request_key 보관
      const request_key = res.request_key;
      //   console.log(request_key);
      Linking.openURL(
        `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=a2a?request_key=${request_key}`,
      );

      //   request(request_key);
      //   const getRequestResult = async request_key => {
      //     const response = await getResult(request_key);
      //     console.log({response});
      //     // do something with res
      //   };
      //   await getRequestResult(request_key);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.select({ios: 'padding'})}>
        <View style={styles.fullscreen}>
          <StatusBar barStyle="dark-content" />

          <View style={{backgroundColor: '#AAD1C1', height: top}} />
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.pop()}>
              <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
              {/* <Text style={styles.buttonText}>Back</Text> */}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.container}>
            <Text style={styles.transferText}>Receive From Klip</Text>
            <View style={styles.imageContainer}>
              <Image source={klipIcon} style={styles.klipIcon} />
            </View>
            <Text style={styles.text}>Amount</Text>
            <TextInput
              style={styles.input}
              value={form.amount}
              onChangeText={createChangeTextHandler('amount')}
              placeholder="KLAY"
              keyboardType="numeric"
              // returnKeyType={'done'}
              onPress={onSubmit}
              selectionColor="#AAD1C1"
            />
            <View style={styles.buttonContainer}>
              <BasicButton
                margin={[30, 0, 0, 0]}
                width={330}
                height={50}
                text={'가져오기'}
                textSize={18}
                backgroundColor="#ffffff"
                border={false}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </View>
            <DoubleModal
              text={'Klip지갑으로부터\n Klay를 가져오시겠습니까?'}
              nButtonText="아니요"
              pButtonText="네"
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              nFunction={() => {
                setModalVisible(false);
              }}
              pFunction={() => {
                recieveKlay().then(result => {});
                // sendKlay().then(result => {
                //   console.log('result.data is');
                //   console.log(result.data);
                //   if (result.data.message === 'success') {
                //     showToast('success', 'KLAY 전송이 완료되었습니다!');
                //     getUser(userInfo.id).then(userDetail => {
                //       // console.log(userDetail);
                //       updateTokenInfo({
                //         tokenAmount: Number(userDetail.tokenAmount),
                //         klayAmount: Number(result.data.balance),
                //         onChainTokenAmount: userInfo.onChainTokenAmount,
                //       });
                //     });
                //     getOnchainKlayLog(userInfo.id).then(res => {
                //       console.log({res});
                //       const logs = res.docs.map(el => {
                //         return {...el.data()};
                //       });
                //       addKlayLog(logs);
                //     });
                //   }
                // });

                setModalVisible(false);
              }}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#AAD1C1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    height: 50,
  },
  container: {
    flex: 1,
    // marginTop: 60,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  klipIcon: {
    // marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    width: 100,
    height: 100,
  },
  input: {
    borderColor: '#1D1E1E',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    backgroundColor: '#ffffff',
    marginHorizontal: 25,
    marginTop: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  transferText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 40,
    marginBottom: 10,
    letterSpacing: -0.5,
    color: '#1D1E1E',
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    marginTop: 20,
    marginLeft: 25,
    color: '#1D1E1E',
    letterSpacing: -0.5,
  },
  backButton: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
  },
});
export default WalletOnchainRecieve;
