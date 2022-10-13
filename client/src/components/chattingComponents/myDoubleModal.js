import React from 'react';
import {View, Modal, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import BasicButton from '../common/BasicButton';
import {changeJoinerState} from '../../lib/Chatting';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseAuth';

/*
사용할 컴포넌트에서 state 사용이 필요함.
  const [modalVisible, setModalVisible] = useState(false);

      <MyDoubleModal
        body={<Text>정말로?</Text>}
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pFunction={() => {}}
      />
 */

function MyDoubleModal({
  body,
  pButtonText,
  nButtonText,
  modalVisible,
  setModalVisible,
  isHost,
  id,
}) {
  const user = useUser();
  const {showToast} = useToast();
  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={[styles.centeredView, styles.backgroudDim]}>
            <View style={styles.modalView}>
              {body}
              <View style={styles.buttonRow}>
                <BasicButton
                  text={nButtonText}
                  textSize={16}
                  width={100}
                  height={45}
                  backgroundColor="white"
                  textColor="black"
                  border={true}
                  margin={[0, 5, 0, 5]}
                  onPress={() => setModalVisible(!modalVisible)}
                />
                <BasicButton
                  text={pButtonText}
                  textSize={16}
                  width={100}
                  height={45}
                  margin={[0, 5, 0, 5]}
                  backgroundColor="#AEFFC1"
                  textColor="black"
                  onPress={() => {
                    changeJoinerState(id, user, setModalVisible).then(
                      result => {
                        result === 'runModal' &&
                          showToast(
                            'basic',
                            'Participation has been confirmed!',
                          );
                      },
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    width: 290,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    borderColor: '#AEFFC1',
    borderWidth: 1,
    position: 'absolute',
  },
  modalText: {
    fontSize: 17,
    fontWeight: '500',
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
export default MyDoubleModal;
