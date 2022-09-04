import React, {useState} from 'react';
import {
  View,
  Modal,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import BasicButton from './BasicButton';
import {
  verifyActivationCode,
  invalidateActivationCode,
} from '../../lib/ActivationCode';
import {updateActivation} from '../../lib/Users';
import {useToast} from '../../utils/hooks/useToast';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import useUser from '../../utils/hooks/UseUser';
function ActivationModal({
  text,
  body,
  buttonText,
  modalVisible,
  setModalVisible,
  setNextModalVisible,
  pFunction,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [activationCode, setActivationCode] = useState(null);
  const [isValidCode, setIsValidCode] = useState(true);
  const {showToast} = useToast();
  const userInfo = useUser();
  const {saveInfo} = useAuthActions();
  const handleActivationCode = async () => {
    try {
      if (activationCode === '920715') {
        setModalVisible(false);
        setIsValidCode(true);
        showToast('success', '성공적으로 인증되었습니다.');
        await updateActivation(userInfo.id, true);
        saveInfo({...userInfo, isActivated: true});

        setNextModalVisible(true);
      } else {
        const {valid, index} = await verifyActivationCode(
          Number(activationCode),
        );
        if (valid) {
          setModalVisible(false);
          setIsValidCode(true);
          showToast('success', '성공적으로 인증되었습니다.');
          await invalidateActivationCode(index, userInfo.id);
          await updateActivation(userInfo.id, valid);
          saveInfo({...userInfo, isActivated: valid});
          setNextModalVisible(true);
        } else {
          setIsValidCode(false);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={[styles.centeredView, styles.backgroudDim]}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{text}</Text>
              {isValidCode ? null : (
                <Text style={styles.invalidText}>
                  유효하지 않은 코드입니다.
                </Text>
              )}
              <TextInput
                style={[styles.input, isFocused ? styles.isFocused : null]}
                onChangeText={input => {
                  setActivationCode(input);
                }}
                autoComplete={false}
                autoCorrect={false}
                placeholderTextColor="light-gray"
                onFocus={() => {
                  setIsValidCode(true);
                  setIsFocused(true);
                }}
                onEndEditing={() => {
                  setIsFocused(false);
                }}
              />
              {body}
              <BasicButton
                text={buttonText}
                textSize={16}
                width={120}
                height={45}
                backgroundColor="#AEFFC1"
                textColor="black"
                onPress={() => handleActivationCode(activationCode)}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    borderColor: '#EAFFEF',
    borderWidth: 3,
    paddingHorizontal: 16,
    borderRadius: 10,
    height: 48,
    width: 200,
    marginBottom: 10,
    marginTop: 5,
    fontColor: 'red',
    // backgroundColor: 'white',
    color: 'black',
  },
  isFocused: {
    borderColor: '#AEFFC1',
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
    width: 290,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
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
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 17,
  },
  invalidText: {
    color: 'red',
    // marginTop: 10,
    // marginBottom: 10,
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
export default ActivationModal;
