import firestore from '@react-native-firebase/firestore';
import {calcHumanElement} from '../lib/NFT';
export const usersCollection = firestore().collection('User');

export function createUser({
  userId,
  email,
  nickName,
  gender,
  birth,
  picture,
  phoneNumber,
  property,
  selfIntroduction,
  marketingAgreement,
}) {
  // return usersCollection.doc(id).get();
  // console.log(usersCollection);
  // const newNickName = nickName ? nickName : '';
  // const newGender = gender ? gender : '';
  // const newBirth = birth ? birth : '';
  // const newPicture = picture ? picture : '';
  return usersCollection.doc(userId).set({
    userId,
    email: email,
    nickName: nickName,
    gender: gender,
    birth: birth,
    createdAt: firestore.FieldValue.serverTimestamp(),
    picture: picture,
    nftProfile: null,
    phoneNumber: phoneNumber,
    nftIds: [],
    address: null,
    privateKey: null,
    tokenAmount: 10,
    klayAmount: 0,
    onChainTokenAmount: 0,
    visibleUser: [],
    createdroomId: [],
    joinedroomId: [],
    likesroomId: [],
    property: property,
    marketingAgreement: marketingAgreement,
    isActivated: false,
    selfIntroduction: selfIntroduction,
    isReadyToGetFreeToken: true,
  });
}

export async function getUser(id) {
  const doc = await usersCollection.doc(id).get();
  return doc.data();
}

export async function getOtherUser(id) {
  const doc = await usersCollection.doc(id).get();
  const userDetail = doc.data();

  const userProperty = await getUserProperty(id);

  const otherUser = userDetail && {
    nickName: userDetail.nickName,
    birth: userDetail.birth,
    gender: userDetail.gender,
    nftProfile: userDetail.nftProfile,
    picture: userDetail.picture,
    property: userDetail.property,
    meminStats: userDetail.meminStats,
  };
  return otherUser;
}

export async function getUserProperty(id) {
  const doc = await usersCollection.doc(id).collection('Property').get();
  const property = doc.docs.map(doc => doc.data());

  return property;
}

export function createProperty({userId, drinkCapa, drinkStyle, alcoholType}) {
  return usersCollection.doc(userId).collection('Property').add({
    drinkCapa,
    drinkStyle,
    alcoholType,
  });
}

export function getFreeToken({userId, updatedTokenAmount}) {
  console.log({userId, updatedTokenAmount});
  return usersCollection.doc(userId).update({
    tokenAmount: updatedTokenAmount,
    isReadyToGetFreeToken: false,
  });
}

export function createPhoneNumber({userId, phoneNumber}) {
  return usersCollection.doc(userId).update({
    phoneNumber: phoneNumber,
  });
}

export function createUserNFT({userId, nftProfile}) {
  return usersCollection.doc(userId).update({
    nftProfile: nftProfile,
    // nftIds: firestore.FieldValue.arrayUnion(nftId),
  });
}
export function updateTokenAmount(userId, balance) {
  return usersCollection.doc(userId).update({
    tokenAmount: balance,
  });
}
export function updateActivation(userId, valid) {
  return usersCollection.doc(userId).update({
    isActivated: valid,
  });
}

//Update cretedroomId, joinedroomId, likesroomId
//userId, 'createdroomId', meetingId
//userId, 'joinedroomId', meetingId
//userId, 'likesroomId', meetingId
export async function updateUserMeetingIn(id, field, value, nickName, status) {
  if (nickName && status) {
    const obj = {
      createdAt: firestore.FieldValue.serverTimestamp(),
      status,
      nickName,
    };
    await firestore()
      .collection('Meeting')
      .doc(value)
      .collection('Messages')
      .add(obj);
  }
  return usersCollection
    .doc(id)
    .update({[field]: firestore.FieldValue.arrayUnion(value)});
}

export async function updateUserMeetingOut(id, field, value, nickName, status) {
  // 나가기 전에 메시지 보내고 나가기
  if (nickName && status) {
    const obj = {
      createdAt: firestore.FieldValue.serverTimestamp(),
      status,
      nickName,
    };
    await firestore()
      .collection('Meeting')
      .doc(value)
      .collection('Messages')
      .add(obj);
  }
  return usersCollection
    .doc(id)
    .update({[field]: firestore.FieldValue.arrayRemove(value)});
}

//nickname으로 User 검색
export async function getUserByNickname(str, loginUser) {
  const strlength = str.length;
  const strFrontCode = str.slice(0, strlength - 1);
  const strEndCode = str.slice(strlength - 1, str.length);
  const endCode =
    strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
  const res = await usersCollection
    .where('nickName', '>=', str)
    .where('nickName', '<', endCode)
    .get();
  const data = res.docs.map(el => {
    if (el.id !== loginUser) {
      return {...el.data(), id: el.id};
    }
  });
  return data.filter(el => el !== undefined);
}

export async function getUserByPhoneNumber(phoneNumber) {
  const res = await usersCollection
    .where('phoneNumber', '==', phoneNumber)
    .get();
  if (res.docs.length === 0) {
    return 'NA';
  } else {
    return res.docs[0]._data.email;
  }
}

export async function addVisibleUser(id, value) {
  return usersCollection
    .doc(id)
    .update({visibleUser: firestore.FieldValue.arrayUnion(value)});
}

export const saveTokenToDatabase = async (token, userId) => {
  try {
    await firestore()
      .collection('User')
      .doc(userId)
      .update({
        deviceTokens: firestore.FieldValue.arrayUnion(token),
      });
  } catch (e) {
    console.log(e, 'There is no doc in user collection');
  }
};

export const deleteTokenFromDatabase = async (token, userId) => {
  await firestore()
    .collection('User')
    .doc(userId)
    .update({
      deviceTokens: firestore.FieldValue.arrayRemove(token),
    });
};

export function deleteUserDB(userId) {
  usersCollection.doc(userId).delete();
}

export async function deletePhoneNumber(userId) {
  await usersCollection.doc(userId).update({phoneNumber: null});
}

export const EditUserInfo = async (
  userId,
  profileImg,
  property,
  selfIntroduction,
) => {
  await usersCollection.doc(userId).update({
    picture: profileImg,
    property: property,
    selfIntroduction,
  });
};

export async function calculateCharm(userId, emotion) {
  let feedback = 0;
  if (emotion === 'fallinlove') {
    feedback = 100;
  } else if (emotion === 'knowmore') {
    feedback = 95;
  } else if (emotion === 'befriend') {
    feedback = 90;
  } else if (emotion === 'soso') {
    feedback = 85;
  } else if (emotion === 'notgood') {
    feedback = 70;
  } else if (emotion === 'terrible') {
    feedback = 60;
  }
  const doc = await usersCollection.doc(userId).get();
  const meminStats = doc.data().meminStats;

  // 매력 지수 환산
  let newCharm = 0;
  if (meminStats.receivedFeedbackCount === 0) {
    newCharm = feedback;
  } else {
    newCharm =
      (meminStats.charm * meminStats.receivedFeedbackCount + feedback) /
      (meminStats.receivedFeedbackCount + 1);
  }

  // 매력 지수에 따른 등급 조정
  let grade = null;
  if (newCharm <= 100 && newCharm > 96) {
    grade = 'A';
  } else if (newCharm <= 96 && newCharm > 91) {
    grade = 'B';
  } else if (newCharm <= 91 && newCharm > 80) {
    grade = 'C';
  } else if (newCharm <= 80 && newCharm > 70) {
    grade = 'D';
  } else {
    grade = 'F';
  }

  await usersCollection.doc(userId).update({
    meminStats: {
      HumanElement: calcHumanElement(grade, meminStats.level),
      receivedFeedbackCount: meminStats.receivedFeedbackCount + 1,
      charm: newCharm,
      energy: meminStats.energy,
      dino: meminStats.dino,
      exp: meminStats.exp,
      grade: grade,
      level: meminStats.level,
      resilience: meminStats.resilience,
    },
  });

  const output = {newCharm, grade};
  return output;
}
