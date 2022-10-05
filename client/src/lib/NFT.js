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
        energyRechargeTime: String(Date.now()).slice(0, 10),
        HumanElement: 5,
        receivedFeedbackCount: 0,
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

export const calcHumanElement = (grade, level) => {
  if (grade === 'new') {
    return 5;
  } else if (grade === 'F') {
    return level * 2;
  } else if (grade === 'E') {
    return 2 + level * 2;
  } else if (grade === 'D') {
    return 4 + level * 2;
  } else if (grade === 'C') {
    return 6 + level * 2;
  } else if (grade === 'B') {
    return 8 + level * 2;
  } else if (grade === 'A') {
    return 10 + level * 2;
  }
};

export const rechargeEnergy = async (userDetail, saveInfo, now) => {
  const {dino} = userDetail.meminStats;
  const recharge = async amount => {
    await firestore()
      .collection('User')
      .doc(userDetail.id)
      .update({
        ...userDetail,
        meminStats: {
          ...userDetail.meminStats,
          energy: userDetail.meminStats.energy + amount,
          energyRechargeTime: now,
        },
      })
      .then(() => {
        saveInfo({
          ...userDetail,
          meminStats: {
            ...userDetail.meminStats,
            energy: userDetail.meminStats.energy + amount,
            energyRechargeTime: now,
          },
        });
      });
  };
  console.log(dino);
  console.log(userDetail);

  if (dino === 'Tyrano' && userDetail.meminStats.energy < 100) {
    // console.log('Tyrano');
    recharge(1);
  } else if (dino === 'Brachio' && userDetail.meminStats.energy < 90) {
    if (userDetail.meminStats.energy === 89) {
      // console.log('Brachio');
      recharge(1);
    } else {
      // console.log('Brachio');
      recharge(2);
    }
  } else if (dino === 'Stego' && userDetail.meminStats.energy < 70) {
    if (userDetail.meminStats.energy === 69) {
      recharge(1);
    } else if (userDetail.meminStats.energy === 68) {
      recharge(2);
    } else if (userDetail.meminStats.energy === 67) {
      recharge(3);
    } else {
      recharge(4);
    }
  } else if (dino === 'Tricera' && userDetail.meminStats.energy < 60) {
    if (userDetail.meminStats.energy === 59) {
      recharge(1);
    } else if (userDetail.meminStats.energy === 58) {
      recharge(2);
    } else if (userDetail.meminStats.energy === 57) {
      recharge(3);
    } else if (userDetail.meminStats.energy === 56) {
      recharge(4);
    } else {
      recharge(5);
    }
  }
};

export const chargeEnergy = async (userInfo, fullEnergy, saveInfo) => {
  if (userInfo.meminStats.energy + 10 > fullEnergy) {
    const num = fullEnergy - userInfo.meminStats.energy;
    await firestore()
      .collection('User')
      .doc(userInfo.id)
      .update({
        ...userInfo,
        meminStats: {
          ...userInfo.meminStats,
          energy: userInfo.meminStats.energy + num,
        },
      })
      .then(() => {
        saveInfo({
          ...userInfo,
          meminStats: {
            ...userInfo.meminStats,
            energy: userInfo.meminStats.energy + num,
          },
        });
      });
  } else {
    await firestore()
      .collection('User')
      .doc(userInfo.id)
      .update({
        ...userInfo,
        meminStats: {
          ...userInfo.meminStats,
          energy: userInfo.meminStats.energy + 10,
        },
      })
      .then(() => {
        saveInfo({
          ...userInfo,
          meminStats: {
            ...userInfo.meminStats,
            energy: userInfo.meminStats.energy + 10,
          },
        });
      });
  }
};
