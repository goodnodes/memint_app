import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';

const meetingCollection = firestore().collection('Meeting');

// userId를 받아 본인의 status를 fixed로 바꿔주는 함수
// 통째로 바꿔주는 것 밖에는 답이 없는것인가..
export const changeJoinerState = async (meetingId, user, setModalVisible) => {
  const userId = user.id;
  return await meetingCollection
    .doc(meetingId)
    .get()
    .then(result => {
      return result.data().members.map(el => {
        return el[userId] ? {[userId]: 'fixed'} : el;
      });
    })
    .then(result => {
      meetingCollection.doc(meetingId).update({
        members: result,
      }),
        setModalVisible(false);
      if (
        result.filter(el => {
          return Object.values(el)[0] === 'accepted';
        }).length === 0
      ) {
        changeMeetingState(meetingId);
      }
      return 'runModal';
    });
};

// meeintgId를 받아 Meeting의 status를 fixed로 바꿔주는 함수
// spendingModal에서 토큰 차감이 완료된 후에 실행되어야한다.
export const changeMeetingState = async meetingId => {
  return await meetingCollection.doc(meetingId).update({
    status: 'fixed',
  });
};

export const setItem = async (id, data) => {
  const stringify = JSON.stringify(data);
  await AsyncStorage.setItem(id, stringify);
};

export const getItem = async id => {
  const result = await AsyncStorage.getItem(id);
  return JSON.parse(result);
};
