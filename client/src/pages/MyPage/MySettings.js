import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Switch,
  Linking,
  StatusBar,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {signOut} from '../../lib/Auth';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import DoubleModal from '../../components/common/DoubleModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

function MySettings({route}) {
  const {top} = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const {logout} = useAuthActions();
  const handleSignOut = useCallback(async () => {
    try {
      logout();
      await signOut();
    } catch (e) {
      console.log(e);
    } finally {
      setModalVisible(false);
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
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor="#ABDCC1"
        animated={true}
      />
      <View style={{backgroundColor: '#ABDCC1', height: top}} />

      {Platform.OS === 'ios' ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.pop()}>
              <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
              {/* <Text style={styles.buttonText}>Back</Text> */}
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>설정</Text>

          <View style={[styles.li, {paddingVertical: 30}]}>
            <Text style={[styles.liText, {fontWeight: 'bold'}]}>현재 버전</Text>
            <Text style={styles.liGrayText}>1.0.0</Text>
          </View>
          <View style={styles.li}>
            <Text style={styles.liText}>이메일</Text>
            <Text style={styles.liGrayText}>{route.params.email}</Text>
          </View>
          <TouchableOpacity style={styles.li} onPress={handleChangePw}>
            <Text style={styles.liText}>비밀번호 변경</Text>
            <Icon name="arrow-forward-ios" size={20} color={'#000000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.li} onPress={handleCsCenter}>
            <Text style={styles.liText}>고객센터</Text>
            <Icon name="arrow-forward-ios" size={20} color={'#000000'} />
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
          <TouchableOpacity style={styles.li} onPress={handleDeletePage}>
            <Text style={styles.liText}>회원 탈퇴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.li}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Text style={styles.liText}>로그아웃</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.backButton}>
              <TouchableNativeFeedback
                style={styles.backButton}
                onPress={() => navigation.pop()}>
                <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
                {/* <Text style={styles.buttonText}>Back</Text> */}
              </TouchableNativeFeedback>
            </View>
          </View>

          <Text style={styles.title}>설정</Text>

          <View style={[styles.li, {paddingVertical: 30}]}>
            <Text style={[styles.liText, {fontWeight: 'bold'}]}>현재 버전</Text>
            <Text style={styles.liGrayText}>1.0.0</Text>
          </View>
          <View style={styles.li}>
            <Text style={styles.liText}>이메일</Text>
            <Text style={styles.liGrayText}>{route.params.email}</Text>
          </View>
          <View>
            <TouchableNativeFeedback onPress={handleChangePw}>
              <View style={styles.li}>
                <Text style={styles.liText}>비밀번호 변경</Text>
                <Icon name="arrow-forward-ios" size={20} color={'#000000'} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <View>
            <TouchableNativeFeedback style={styles.li} onPress={handleCsCenter}>
              <View style={styles.li}>
                <Text style={styles.liText}>고객센터</Text>
                <Icon name="arrow-forward-ios" size={20} color={'#000000'} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.li}>
            <TouchableNativeFeedback
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
            </TouchableNativeFeedback>
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
          <View style={styles.li}>
            <TouchableNativeFeedback onPress={handleDeletePage}>
              <Text style={styles.liText}>회원 탈퇴</Text>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.li}>
            <TouchableNativeFeedback
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text style={styles.liText}>로그아웃</Text>
            </TouchableNativeFeedback>
          </View>
        </>
      )}
      <DoubleModal
        text="로그아웃 하시겠습니까?"
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pFunction={handleSignOut}
        nFunction={() => {
          setModalVisible(!modalVisible);
        }}
      />
    </View>
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
    paddingVertical: 5,
    height: 50,
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
    paddingVertical: 15,
  },
  liText: {
    fontSize: 16,
    color: '#000000',
    letterSpacing: -0.5,
    lineHeight: 22.4,
  },
  liGrayText: {
    fontSize: 16,
    color: '#1D1E1E',
    fontWeight: '500',
    lineHeight: 22.4,
    letterSpacing: -0.5,
  },
  deleteText: {
    fontSize: 16,
    color: '#EE3232',
  },
  backButton: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
  },
});

export default MySettings;
