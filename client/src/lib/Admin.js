import firestore from '@react-native-firebase/firestore';

export const adminCollection = firestore().collection('Admin');

export async function getNFTNum() {
  try {
    const doc = await adminCollection.doc('NFTadmin').get();
    return doc.data().User.length;
  } catch (e) {
    console.log(e);
  }
}

export async function addUserlog(id) {
  try {
    adminCollection.doc('NFTadmin').update({
      User: firestore.FieldValue.arrayUnion(id),
    });
  } catch (e) {
    console.log(e);
  }
}
