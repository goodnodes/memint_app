import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

function MyProfile({User, navigation}) {
  return (
    <ScrollView contentContainerStyle={styles.marginBottom}>
      {/* <View>
        <View style={{position: 'absolute', top: 0, right: 0, zIndex: 2}}>
          <Icon
            name="edit"
            size={30}
            style={styles.edit}
            onPress={() => navigation.navigate('EditMyInfo')}
          />
        </View>
        <Image
          style={{width: window.width, height: 300}}
          source={{
            uri: User.nftProfile,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            width: window.width,
            height: 300,
            // borderWidth: 1,
            // borderColor: 'black'
          }}>
          <View
            style={{backgroundColor: 'white', width: window.width, height: 50}}
          />
          <View
            style={{
              backgroundColor: 'white',
              opacity: 0.5,
              width: window.width,
              height: 200,
            }}
          />
          <View
            style={{backgroundColor: 'white', width: window.width, height: 50}}
          />
        </View>

        <MyMeMin myMeMin={myMemin} />
      </View> */}
      <View style={styles.imageWrapper}>
        <Image
          style={styles.profileImage}
          source={{
            uri: User.picture,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.push('EditMyInfo', User, navigation);
          }}
          style={styles.editButton}>
          <Icon
            name="edit"
            size={23}
            color="#1D1E1E"
            style={{marginRight: 10, position: 'absolute', top: 7, left: 9}}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfos}>
        <Text style={styles.userNickName}>{User.nickName}</Text>
        <Text style={styles.userBirth}>{User.birth}</Text>
        <Text style={styles.userBirth}>
          {User.selfIntroduction === undefined ? '' : User.selfIntroduction}
        </Text>
      </View>
      <View style={styles.userTags}>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>MBTI</Text>
          <View style={styles.tag}>
            <Text style={styles.tagFont}>{User.property.mbti}</Text>
          </View>
        </View>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>주출몰지</Text>
          <View style={styles.tags}>
            {User.property.region.map((el, index) => (
              <View style={styles.tag} key={index}>
                <Text style={styles.tagFont}>{el}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>자주 보는 유튜브</Text>
          <View style={styles.plainTag}>
            <Text style={styles.tagFont}>{User.property.favYoutube}</Text>
          </View>
        </View>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>닮은꼴 연예인</Text>
          <View style={styles.plainTag}>
            <Text style={styles.tagFont}>{User.property.twinCeleb}</Text>
          </View>
        </View>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>주량</Text>
          <View style={styles.tag}>
            <Text style={styles.tagFont}>{User.property.drinkCapa}</Text>
          </View>
        </View>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>선호 주류</Text>
          <View style={styles.tags}>
            {User.property.alcoholType.map((el, index) => (
              <View style={styles.tag} key={index}>
                <Text style={styles.tagFont}>{el}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>술자리 스타일</Text>
          <View style={styles.tags}>
            {User.property.drinkStyle.map((el, index) => (
              <View style={styles.tag} key={index}>
                <Text style={styles.tagFont}>{el}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>통금</Text>
          <View style={styles.tag}>
            <Text style={styles.tagFont}>{User.property.curfew}</Text>
          </View>
        </View>
        <View style={styles.userTag}>
          <Text style={styles.tagText}>주력 게임</Text>
          <View style={styles.tags}>
            {User.property.favGame.map((el, index) => (
              <View style={styles.tag} key={index}>
                <Text style={styles.tagFont}>{el}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* <MyNFT User={User} /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  edit: {
    marginRight: 10,
    marginTop: 5,
  },
  container: {
    flexDirection: 'row',
  },
  layer: {
    backgroundColor: 'white',
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  images: {
    flex: 0.4,
    marginHorizontal: 30,
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
    width: 230,
    height: 230,
    borderRadius: 999,
    borderColor: '#ffffff',
    borderWidth: 5,
  },
  imageWrapper: {
    marginTop: 32,
    marginBottom: 7,
    alignItems: 'center',
  },
  userInfos: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userNickName: {
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: -0.5,
    fontFamily: 'NeoDunggeunmoPro-Regular',
    color: '#1D1E1E',
    lineHeight: 28,
    marginBottom: 5,
  },
  userBirth: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3C3D43',
    marginTop: 2,
    letterSpacing: -0.5,
    lineHeight: 19.6,
  },
  userTags: {
    marginVertical: 16,
    marginHorizontal: 15,
  },
  userTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  tagText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#3C3D43',
    lineHeight: 21,
    letterSpacing: -0.5,
    width: width * 0.3,
  },
  mintButton: {
    top: -30,
    left: 60,
    paddingBottom: 0,
  },
  tags: {
    maxWidth: width * 0.67,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tag: {
    backgroundColor: '#EAFFEFCC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 99,
    borderColor: 'transparent',
    borderWidth: 1,
    marginHorizontal: 4,
    maxWidth: width * 0.67,
  },
  tagFont: {
    fontSize: 14,
    fontWeight: '400',
    color: '#3C3D43',
    lineHeight: 19.6,
    letterSpacing: -0.5,
  },

  badge: {
    width: 35,
    height: 35,
    marginRight: -20,
    top: 28,
    left: 15,
    position: 'absolute',
  },
  plainTag: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 99,
    borderColor: 'transparent',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  marginBottom: {
    paddingBottom: 140,
  },
  editButton: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    position: 'absolute',
    bottom: 0,
    right: 100,
  },
});

export default MyProfile;
