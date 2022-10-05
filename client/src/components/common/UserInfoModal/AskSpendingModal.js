import React from 'react';
import {View, Modal, StyleSheet, Text} from 'react-native';
import BasicButton from '../BasicButton';
import useUser from '../../../utils/hooks/UseUser';

/*
사용할 컴포넌트에서 state 사용이 필요함.
  const [askSpendingModalVisible, setAskSpendingModalVisible] = useState(false);

      <AskSpendingModal
        nButtonText="아니오"
        pButtonText="네"
        askSpendingModalVisible={askSpendingModalVisible}
        setAskSpendingModalVisible={setAskSpendingModalVisible}
        pFunction={() => {}}
      />
 */

function AskSpendingModal({
  pButtonText,
  nButtonText,
  askSpendingModalVisible,
  setAskSpendingModalVisible,
  pFunction,
  amount,
}) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={askSpendingModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 18, fontWeight: '500', color: '#000000'}}>
                프로필 사진을 확인하시겠어요?
              </Text>
              <Text
                style={{
                  fontWeight: '600',
                  margin: 10,
                  fontSize: 16,
                  color: '#000000',
                }}>
                {`${amount}TING이 소모됩니다.`}
              </Text>
            </View>
            <View style={styles.buttonRow}>
              <BasicButton
                text={nButtonText}
                variant="disable"
                backgroundColor={'#ffffff'}
                width={100}
                height={45}
                textSize={16}
                onPress={() =>
                  setAskSpendingModalVisible(!askSpendingModalVisible)
                }
              />
              <BasicButton
                width={100}
                height={45}
                textSize={16}
                text={pButtonText}
                onPress={pFunction}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 35,
    alignItems: 'center',
    borderColor: '#58FF7D',
    borderWidth: 1,
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
  },
});
export default AskSpendingModal;
