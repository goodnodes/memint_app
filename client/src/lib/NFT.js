import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {usersCollection} from './Users';
import {getNFTNum, addUserlog} from './Admin';

export const NFTCollection = firestore().collection('NFT');

export async function getImgUrl() {
  const randNum1 = Math.floor(Math.random() * 3 + 3);
  const randNum2 = Math.floor(Math.random() * 10);
  try {
    const imgUrl = await storage()
      .ref(`/NFTs/dinosaur_nft_0${randNum1}${randNum2}.png`)
      .getDownloadURL();
    return imgUrl;
  } catch (e) {
    console.log(e);
  }
}

//NFT 스키마에 넣을 doc을 create
export function createNFT({userId, nftImg}) {
  return NFTCollection.add({
    userId,
    nftImg,
    isProfile: true,
    isMemin: true,
  });
}

//프로필 렌더링
export async function filterProfile(userId) {
  let query = NFTCollection.where('userId', '==', userId).where(
    'isProfile',
    '==',
    true,
  );
  const profile = await query.get();
  const profileImg = profile.docs.map(doc => doc.data().nftImg);
  return profileImg.toString();
}

//미민이 렌더링
export async function filterMemin(userId) {
  let query = NFTCollection.where('userId', '==', userId).where(
    'isMemin',
    '==',
    true,
  );
  const doc = await query.get();
  const memin = doc.docs.map(doc => doc.data());
  return memin;
}

// 모든 NFT 렌더링
export async function getNFTs(userId) {
  return await NFTCollection.where('userId', '==', userId).get();
}

export function getProfile(nfts) {
  const profile = nfts.filter(el => {
    return el.isProfile === true;
  });

  return profile;
}
export function getMemin(nfts) {
  const memin = nfts.filter(el => {
    return el.isMemin === true;
  });

  return memin;
}

export async function getMeminbyNum(num, id) {
  const doc = await firestore()
    .collection('NFTStorage')
    .doc(`MEMIN#${num}`)
    .get();
  const memin = doc.data();
  console.log(memin);
  if (memin.valid) {
    // user 콜렉션에 nftProfile 추가
    usersCollection.doc(id).update({
      nftProfile: memin.url,
      meminStats: {
        dino: memin.dino,
        energy: memin.energy,
        resilience: memin.resilience,
        charm: 0,
        grade: 'new',
        exp: 0,
        level: 1,
      },
    });

    // NFT storage에 사용한 MEMIN 앞으로 못 쓰게 false로 변경
    firestore()
      .collection('NFTStorage')
      .doc(`MEMIN#${num}`)
      .update({valid: false});

    //Admin User log에 추가
    return addUserlog(id);
  } else {
    getMeminbyNum(num + 1);
    addUserlog(id);
  }
}

export async function getNFTbyNum(id) {
  //현재 사용할 수 있는 Memin 넘버 받아옴
  const num = await getNFTNum();
  await getMeminbyNum(num, id);
}
