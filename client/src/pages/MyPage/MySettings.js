import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Switch,
  Linking,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {signOut} from '../../lib/Auth';
import useAuthActions from '../../utils/hooks/UseAuthActions';

function MySettings({route}) {
  const navigation = useNavigation();
  const {logout} = useAuthActions();
  const handleSignOut = useCallback(async () => {
    try {
      logout();
      await signOut();
    } catch (e) {
      console.log(e);
    } finally {
      navigation.navigate('SignIn');
    }
  }, [navigation, logout]);

  const handleCsCenter = () => {
    navigation.navigate('Report');
  };

  const handleDeletePage = () => {
    navigation.navigate('DeleteUser', route.params);
  };
  const handleChangePw = () => {
    navigation.navigate('ChangePw', route.params);
  };
  const [pushAgree, setPushAgree] = useState(false);
  const [mailAgree, setMailAgree] = useState(false);
  const [smsAgree, setSMSAgree] = useState(false);
  const handlePushToggle = () => {
    setPushAgree(!pushAgree);
  };
  const handleMailTogle = () => {
    setMailAgree(!mailAgree);
  };
  const handleSmsTogle = () => {
    setSMSAgree(!smsAgree);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.pop()}>
        <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
        {/* <Text style={styles.buttonText}>Back</Text> */}
      </TouchableOpacity>
      <Text style={styles.title}>설정</Text>

      <View style={{...styles.li, paddingVertical: 20}}>
        <Text style={{...styles.liText, fontWeight: 'bold'}}>현재 버전</Text>
        <Text style={styles.liGrayText}>1.0.0</Text>
      </View>
      <View style={styles.li}>
        <Text style={styles.liText}>이메일</Text>
        <Text style={styles.liGrayText}>{route.params.email}</Text>
      </View>
      <TouchableOpacity style={styles.li} onPress={handleChangePw}>
        <Text style={styles.liText}>비밀번호 변경</Text>
        <Icon name="arrow-forward-ios" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.li} onPress={handleCsCenter}>
        <Text style={styles.liText}>고객센터</Text>
        <Icon name="arrow-forward-ios" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.li}
        onPress={async () => {
          await Linking.openSettings();
        }}>
        <Text style={styles.liText}>Push 알림 동의</Text>
        {/* <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={pushAgree ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handlePushToggle}
          value={pushAgree}
        /> */}
      </TouchableOpacity>
      <View style={styles.li}>
        <Text style={styles.liText}>메일 수신 동의</Text>
        <Switch
          trackColor={{false: '#ABDCC1', true: '#81b0ff'}}
          thumbColor={mailAgree ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleMailTogle}
          value={mailAgree}
        />
      </View>
      <View style={styles.li}>
        <Text style={styles.liText}>SMS 수신 동의</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={smsAgree ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleSmsTogle}
          value={smsAgree}
        />
      </View>
      <TouchableOpacity style={styles.li} onPress={handleDeletePage}>
        <Text style={styles.liText}>회원 탈퇴</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.li} onPress={handleSignOut}>
        <Text style={styles.liText}>로그아웃</Text>
      </TouchableOpacity>
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
  },
  title: {
    marginLeft: 15,
    fontWeight: '400',
    marginTop: 20,
    fontSize: 24,
    color: '#1D1E1E',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },
  ul: {
    marginTop: 10,
  },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  liText: {
    fontSize: 16,
  },
  liGrayText: {
    fontSize: 16,
    color: '#868686',
  },
  deleteText: {
    fontSize: 16,
    color: '#EE3232',
  },
  backButton: {
    paddingLeft: 15,
    paddingTop: 5,
  },
});

export default MySettings;
