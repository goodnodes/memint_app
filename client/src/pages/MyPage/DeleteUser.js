import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

function DeleteUser({route}) {
  // useEffect(() => {
  //   console.log(route.params);
  // }, []);
  const user = route.params;
  const navigation = useNavigation();

  const handleNextPage = () => {
    navigation.navigate('ReverifyForDelete', {user});
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.pop()}>
          <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
          {/* <Text style={styles.buttonText}>Back</Text> */}
        </TouchableOpacity>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>회원탈퇴</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bigText}>{user.nickName}님,</Text>
          <Text style={styles.bigText}>MEMINT를 탈퇴하시겠습니까?</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.boldText}>
            탈퇴하기 전 아래 내용을 확인해 주세요.
          </Text>
          <Text>
            - 미민이 정보, 프로필 사진, 미팅 정보, 채팅 기록 등 회원님의 모든
            활동 정보가 삭제되며, 삭제된 데이터는 복구할 수 없어요.
          </Text>
          <Text>- 보유하신 토큰 또한 복구가 불가합니다.</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNextPage}>
          <Text style={styles.buttonText}>다음으로</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ABDCC1',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    color: '#1D1E1E',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 40,
  },
  section: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 30,
  },
  bigText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    marginVertical: 2,
  },
  boldText: {
    fontWeight: '700',
    marginBottom: 3,
  },
  button: {
    // marginTop: 'auto',
    // marginBottom: 30,
    marginHorizontal: 15,
    backgroundColor: '#ffffff',
    width: '100%',
    height: 50,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18,
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    color: '#1D1E1E',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.01,
  },
  backButton: {
    marginLeft: 15,
  },
  titleRow: {
    width: '100%',
  },
});
export default DeleteUser;
