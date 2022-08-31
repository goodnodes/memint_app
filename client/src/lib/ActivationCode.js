import firestore from '@react-native-firebase/firestore';

export async function verifyActivationCode(activationCode) {
  const res = await firestore()
    .collection('ActivationCode')
    .where('ActivationCode', '==', activationCode)
    .get();
  if (res.docs.length === 0) {
    return {valid: false, index: false};
  } else {
    return {valid: res.docs[0]._data.valid, index: res.docs[0]._data.Index};
  }
}

export async function invalidateActivationCode(index, userId) {
  const res = await firestore()
    .collection('ActivationCode')
    .doc(String(index))
    .update({
      valid: false,
      userId: userId,
    });
  return;
}
