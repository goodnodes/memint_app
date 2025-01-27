import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../../components/common/BackButton';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {getUserByNickname} from '../../lib/Users';
import useUser from '../../utils/hooks/UseUser';
import LinearGradient from 'react-native-linear-gradient';

function InviteFriend() {
  const userInfo = useUser();
  const loginUser = userInfo.id;
  const [searchNickName, setSearchNickName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const navigation = useNavigation();
  const handleSubmit = async () => {
    //return 시 검색 결과를 받아옴
    const data = await getUserByNickname(searchNickName, loginUser);
    setSearchResult(data);
  };
  const handleSelect = el => {
    navigation.navigate('MeetingCreate', {
      friendId: el.id,
      friendNickname: el.nickName,
    });
  };

  return (
    <View style={styles.view}>
      <SafeStatusBar />
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 0.3, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.headerBar}>
          <BackButton />
          <Text style={styles.title}>친구 초대하기</Text>
        </View>
        <View>
          <View style={styles.searchBar}>
            <Icon
              name="search"
              size={26}
              style={styles.icon}
              color={'#EAFFEF'}
            />
            <TextInput
              style={styles.textInput}
              placeholder="닉네임 검색"
              placeholderTextColor="#EAFFEF"
              onChangeText={setSearchNickName}
              multiline={true}
              blurOnSubmit={true}
              onSubmitEditing={handleSubmit}
              autoComplete={false}
              autoCapitalize={false}
            />
          </View>
          <View>
            <View>
              {searchResult.map((el, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.userElement}
                  onPress={() => {
                    handleSelect(el);
                  }}>
                  <Image
                    source={{uri: el?.nftProfile}}
                    style={styles.userImage}
                  />
                  <Text style={styles.username}>{el.nickName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
  },
  gradientBackground: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60,
    borderBottomColor: '#EAFFEF',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    margin: 5,
    marginLeft: 10,
    color: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    padding: 10,
    borderBottomColor: '#EAFFEF',
    borderBottomWidth: 1,
    height: 60,
  },
  textInput: {
    margin: 5,
    color: '#ffffff',
  },
  icon: {
    margin: 5,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  userElement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  username: {
    fontSize: 16,
    paddingLeft: 15,
    color: '#ffffff',
  },
});
export default InviteFriend;
