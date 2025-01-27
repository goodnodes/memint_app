import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import {notification} from './api/notification';

const userCollection = firestore().collection('User');
const adminCollection = firestore().collection('Admin');
//userId로 모든 알림 조회
export const getAlarmsById = async userId => {
  const res = await userCollection.doc(userId).collection('Alarm').get();

  return res.docs.map(el => {
    return el.data();
  });
};

// //alarmId로 알림 조회
// export const getAlarm = async alarmId => {
//   return await alarmCollection.doc(alarmId).get();
// };

//미팅 신청 알림 생성
//sender, receiver, meetingId, message
export const createMeetingProposal = data => {
  // return userCollection.doc(data.receiver).update({
  //   alarms: firestore.FieldValue.arrayUnion({
  //     type: 'proposal',
  //     sender: data.sender,
  //     meetingId: data.meetingId,
  //     message: data.message,
  //     createdAt: firestore.Timestamp.now(),
  //     complete: false,
  //   }),
  // });
  return userCollection
    .doc(data.receiver)
    .collection('Alarm')
    .add({
      type: 'proposal',
      sender: data.sender,
      meetingId: data.meetingId,
      message: data.message,
      createdAt: firestore.Timestamp.now(),
      complete: false,
    })
    .then(() => {
      notification({
        receiver: data.receiver,
        message: '미팅 신청 메시지가 도착했습니다!',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//미팅 수락 알림 생성
//sender, receiver, meetingId
export const createMeetingAccept = ({...data}) => {
  // return userCollection.doc(data.receiver).update({
  //   alarms: firestore.FieldValue.arrayUnion({
  //     type: 'accept',
  //     sender: data.sender,
  //     meetingId: data.meetingId,
  //     createdAt: firestore.Timestamp.now(),
  //   }),
  // });
  return userCollection
    .doc(data.receiver)
    .collection('Alarm')
    .add({
      type: 'accept',
      sender: data.sender,
      meetingId: data.meetingId,
      createdAt: firestore.Timestamp.now(),
    })
    .then(() => {
      notification({
        receiver: data.receiver,
        message: '수락 메시지가 도착했습니다!',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

//미팅 퇴장 알림 생성
//sender, receiver, meetingId
export const createMeetingBanned = data => {
  // return userCollection.doc(data.receiver).update({
  //   alarms: firestore.FieldValue.arrayUnion({
  //     type: 'banned',
  //     sender: data.sender,
  //     meetingId: data.meetingId,
  //     createdAt: firestore.Timestamp.now(),
  //   }),
  // });
  return userCollection.doc(data.receiver).collection('Alarm').add({
    type: 'banned',
    sender: data.sender,
    meetingId: data.meetingId,
    createdAt: firestore.Timestamp.now(),
  });
};

export const createConfirmAlarm = async data => {
  const res = await adminCollection.get();
  const adminId = res.docs.map(el => {
    return el.id;
  })[0];
  return await adminCollection.doc(adminId).collection('Alarm').add({
    type: 'confirmRequest',
    sender: data.sender,
    meetingId: data.meetingId,
    createdAt: firestore.Timestamp.now(),
  });
};

//alarms를 유저 필드로 옮기면서 미팅 수락 시 변화 없고, 알림 detail에서 조건부 렌더링 구현
// //미팅 수락 시 신청 알림에 대해 완료 상태로 update
// export const updateMeetingProposal = alarmId => {
//   return alarmCollection.doc(alarmId).update({complete: true});
// };

//delete
// export const deleteAlarm = alarmId => {
//   return alarmCollection.doc(alarmId).delete();
// };
