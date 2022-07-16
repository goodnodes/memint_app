import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import BasicButton from '../../components/common/BasicButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SingleModal from '../../components/common/SingleModal';

function Profile({User}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [showNFT, setShowNFT] = useState(false);

  return (
    <SafeAreaView>
      <View style={{alignItems: 'flex-end'}}>
        <Icon name="edit" size={30} style={styles.edit} />
      </View>
      <View style={styles.container}>
        <View style={styles.images}>
          <Image
            style={styles.nftImage}
            source={{
              uri: User.nftImage,
            }}
          />
          <Image
            style={styles.profileImage}
            source={{
              uri: User.profileImage,
            }}
          />
        </View>
        <View style={styles.userInfos}>
          <Text style={styles.userInfo}>닉네임: {User.nickName}</Text>
          <Text style={styles.userInfo}>생년월일: {User.birth}</Text>
          <Text style={styles.userInfo}>성별: {User.gender}</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.attribute}>나의 미민이</Text>
      </View>
      <View style={{height: 90}}>
        <Image
          style={styles.myMeMin}
          source={{
            uri: User.myMeMin,
          }}
        />
        <View style={styles.mintButton}>
          <BasicButton
            text="민팅하기"
            size="xSmall"
            variant="basic"
            onPress={() => setModalVisible(true)}
          />
          <SingleModal
            text="프로필을 NFT로 민팅하시겠습니까?"
            buttonText="민팅하기"
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            pFunction={setModalVisible}
          />
        </View>
      </View>
      <View style={{...styles.container, justifyContent: 'space-between'}}>
        <Text style={styles.attribute}>나의 NFT</Text>
        <Icon
          name="arrow-drop-down"
          size={30}
          onPress={() => setShowNFT(!showNFT)}
        />
      </View>

      {showNFT ? (
        <View style={{...styles.container, marginLeft: 35}}>
          {User.myNFTs.map(ele => (
            <Image style={styles.nft} source={{uri: ele}} />
          ))}
        </View>
      ) : null}
      <Text style={styles.attribute}>주량</Text>
      <View style={styles.tagContainer}>
        {User.alcoholQuantity.map(el => (
          <View style={styles.tag}>
            <Text style={styles.tagFont}># {el}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.attribute}>선호 주류</Text>
      <View style={styles.tagContainer}>
        {User.alcoholType.map(el => (
          <View style={styles.tag}>
            <Text style={styles.tagFont}># {el}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.attribute}>스타일</Text>
      <View style={styles.tagContainer}>
        {User.alcoholStyle.map(el => (
          <View style={styles.tag}>
            <Text style={styles.tagFont}># {el}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  edit: {
    top: 20,
    left: -10,
  },
  container: {
    flexDirection: 'row',
  },
  images: {
    flex: 0.4,
    marginHorizontal: '5%',
    marginVertical: '0%',
  },
  nftImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    top: 35,
    left: 15,
    position: 'relative',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
    top: 0,
    left: 95,
    position: 'relative',
  },
  myMeMin: {
    width: 60,
    height: 60,
    borderRadius: 100,
    top: 0,
    left: 40,
    marginVertical: '3%',
    position: 'relative',
  },
  nft: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginHorizontal: '1%',
    marginBottom: '3%',
  },
  userInfos: {
    marginVertical: '10%',
    flex: 0.6,
  },
  userInfo: {
    fontSize: 17,
    fontWeight: '500',
    marginHorizontal: '5%',
    marginVertical: '5%',
  },
  attribute: {
    fontSize: 20,
    fontWeight: '500',
    marginHorizontal: '10%',
    marginVertical: '2%',
  },

  mintButton: {
    top: -30,
    left: 60,
    paddingBottom: 0,
  },

  tag: {
    paddingHorizontal: '2%',
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginVertical: '2%',
    marginBottom: 6,
  },
  tagContainer: {
    flexDirection: 'row',
    marginHorizontal: '10%',
    flexWrap: 'wrap',
  },
  tagFont: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 13,
  },
});

export default Profile;
