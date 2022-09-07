import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import MyProfile from '../../components/myPageComponent/MyProfle';
import useUser from '../../utils/hooks/UseUser';
import WalletButton from '../../components/common/WalletButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function MyPage({navigation}) {
  const user = useUser();
  const {top} = useSafeAreaInsets();
  // useEffect(() => {
  //   console.log(user);
  // }, []);

  return (
    <View style={styles.view}>
      <StatusBar barStyle="dark-content" />

      <View style={{backgroundColor: '#82EFC1', height: top}} />
      <LinearGradient
        colors={['#82EFC1', '#ffffff']}
        start={{x: 0.5, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.pop()}>
            <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
            {/* <Text style={styles.buttonText}>Back</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('MySettings', user);
            }}>
            <Icon
              name="menu"
              size={25}
              color="#1D1E1E"
              style={{marginRight: 10}}
            />
          </TouchableOpacity>
        </View>
        {/* 유저 프로필 */}
        <MyProfile User={user} navigation={navigation} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#82EFC1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    height: 50,
  },
  gradientBackground: {
    flex: 1,
  },
  backButton: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
  },
  meetingButton: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mymeetings: {
    marginBottom: 50,
    marginTop: 20,
  },
  marginBottom: {
    marginBottom: 100,
  },
});
export default MyPage;
