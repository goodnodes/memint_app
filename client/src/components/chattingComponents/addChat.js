import React, {useContext, useReducer, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatContext from './context/chatContext';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';
import {notification} from '../../lib/api/notification';

// props로 채팅방의 아이디를 받아온다.
function AddChat({chatId, roomInfo}) {
  const user = useUser().id;
  const userNickname = useUser().nickName;
  const sendChat = async obj => {
    const chattingCollection = firestore()
      .collection('Meeting')
      .doc(chatId)
      .collection('Messages');
    const confirm = await chattingCollection.add(obj);
    await sendNotification(obj);

    return confirm;
  };

  const sendNotification = obj => {
    try {
      for (let member of roomInfo.members) {
        if (Object.keys(member)[0] === user) {
          continue;
        } else {
          notification({
            receiver: Object.keys(member)[0],
            message: userNickname + ' : ' + obj.text,
            title: roomInfo.title,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // TextInput에 담긴 값을 text라는 state로 저장한다.
  const [text, setText] = useState('');
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder="메시지를 입력하세요"
        placeholderTextColor="#ffffff"
        value={text}
        onChangeText={setText}
        autoCorrect={false}
        selectionColor="#58FF7D"
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          const obj = {
            createdAt: firestore.FieldValue.serverTimestamp(),
            sender: user,
            text,
          };
          text && sendChat(obj);
          setText('');
        }}>
        <Icon name="send" size={30} color="#58FF7D" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 16,
    borderColor: '#58FF7D',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 99,
  },
  input: {
    width: '90%',
    flexWrap: 'wrap',
    fontSize: 17,
    paddingVertical: 8,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
});

export default AddChat;
