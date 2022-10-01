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
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import DoubleModal from '../../components/common/DoubleModal';
import {useToast} from '../../utils/hooks/useToast';
import {transferLCN} from '../../lib/api/wallet';
import {getUser} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tingsymbol from '../../assets/icons/tingsymbol.png';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {getOnchainTokenLog} from '../../lib/OnchainTokenLog';
import useOnchainActions from '../../utils/hooks/UseOnchainActions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const WalletLcnTransfer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {showToast} = useToast();
  const userInfo = useUser();
  const {addLcnLog} = useOnchainActions();
  const {top} = useSafeAreaInsets();
  const {updateTokenInfo} = useAuthActions();
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
  const sendLCN = async () => {
    const body = {
      id: userInfo.id,
      tokenAmount: form.amount,
      toAddress: form.address,
    };
    try {
      return await transferLCN(body);
    } catch (e) {
      console.log(e);
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
            <Text style={styles.transferText}>Transfer</Text>
            <View style={styles.imageContainer}>
              <Image source={tingsymbol} style={styles.icon} />
            </View>
            <Text style={styles.text}>To Address</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={createChangeTextHandler('address')}
              onPress={onSubmit}
              selectionColor={'#AAD1C1'}
            />
            <Text style={styles.text}>Amount</Text>
            <TextInput
              style={styles.input}
              value={form.amount}
              onChangeText={createChangeTextHandler('amount')}
              placeholder="TING"
              keyboardType="numeric"
              // returnKeyType={'done'}
              onPress={onSubmit}
              selectionColor={'#AAD1C1'}
            />
            <View style={styles.buttonContainer}>
              <BasicButton
                margin={[30, 0, 0, 0]}
                width={330}
                height={50}
                text={'보내기'}
                backgroundColor="#ffffff"
                border={false}
                textSize={18}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </View>
            <DoubleModal
              text="보내시겠습니까?"
              nButtonText="아니요"
              pButtonText="네"
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              nFunction={() => {
                setModalVisible(false);
              }}
              pFunction={() => {
                sendLCN().then(result => {
                  if (result.data.message === 'success') {
                    showToast('success', 'TING 전송이 완료되었습니다!');
                    getUser(userInfo.id).then(userDetail => {
                      updateTokenInfo({
                        tokenAmount: Number(userDetail.tokenAmount),
                        klayAmount: userInfo.klayAmount,
                        onChainTokenAmount: Number(result.data.balance),
                      });
                      getOnchainTokenLog(userInfo.id).then(res => {
                        console.log({res});
                        const logs = res.docs.map(el => {
                          return {...el.data()};
                        });
                        addLcnLog(logs);
                      });
                    });
                  }
                });

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
  icon: {
    // marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    width: 50,
    height: 50,
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
export default WalletLcnTransfer;
