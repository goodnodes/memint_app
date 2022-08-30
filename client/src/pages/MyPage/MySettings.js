import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Switch} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BackButton from '../../components/common/BackButton';
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
    navigation.navigate('CsCenter');
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
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>설정</Text>
      </View>
      <View style={{...styles.li, paddingVertical: 20}}>
        <Text style={{...styles.liText, fontWeight: 'bold'}}>현재 버전</Text>
        <Text style={styles.liGrayText}>1.0.0</Text>
      </View>
      <View style={styles.li}>
        <Text style={styles.liText}>이메일</Text>
        <Text style={styles.liGrayText}>{route.params.email}</Text>
      </View>
      <TouchableOpacity style={styles.li}>
        <Text style={styles.liText}>비밀번호 변경</Text>
        <Icon name="arrow-forward-ios" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.li} onPress={handleCsCenter}>
        <Text style={styles.liText}>고객센터</Text>
        <Icon name="arrow-forward-ios" size={20} />
      </TouchableOpacity>
      <View style={styles.li}>
        <Text style={styles.liText}>Push 알림 동의</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={pushAgree ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handlePushToggle}
          value={pushAgree}
        />
      </View>
      <View style={styles.li}>
        <Text style={styles.liText}>메일 수신 동의</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
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
      <TouchableOpacity style={styles.li}>
        <Text style={styles.liText}>회원 탈퇴</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.li} onPress={handleSignOut}>
        <Text style={styles.deleteText}>로그아웃 하기</Text>
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
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  ul: {
    marginTop: 10,
  },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
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
});

export default MySettings;
