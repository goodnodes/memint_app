import firestore from '@react-native-firebase/firestore';

export const NFTCollection = firestore().collection('NFT');

export async function getOffchainTokenLog(userId) {
  const offchainTokenLog = await firestore()
    .collection('User')
    .doc(userId)
    .collection('OffchainTokenLog')
    .orderBy('createdAt', 'desc')
    .get();

  return offchainTokenLog;
}

export async function createSpendOffTxLg(userId, amount, txType, balance) {
  await firestore()
    .collection('User')
    .doc(userId)
    .collection('OffchainTokenLog')
    .add({
      amount,
      txType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      from: userId,
      to: 'serverId',
      balance: Math.round((balance - amount) * 10) / 10,
    });

  await firestore()
    .collection('User')
    .doc(userId)
    .update({
      tokenAmount: Math.round((balance - amount) * 10) / 10,
    });
}

export async function createEarnOffTxLg(userId, amount, txType, balance) {
  await firestore()
    .collection('User')
    .doc(userId)
    .collection('OffchainTokenLog')
    .add({
      amount,
      txType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      from: 'serverId',
      to: userId,
      balance,
    });
  await firestore()
    .collection('User')
    .doc(userId)
    .update({
      tokenAmount: Math.round((balance + amount) * 10) / 10,
    });
}

export async function createEarnOffTxLog(userId, amount, txType, balance) {
  return await firestore()
    .collection('User')
    .doc(userId)
    .collection('OffchainTokenLog')
    .add({
      amount,
      txType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      from: 'serverId',
      to: userId,
      balance: Math.round(balance * 10) / 10,
    });
}
