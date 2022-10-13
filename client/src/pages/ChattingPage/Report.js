import React from 'react';
import {
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BasicButton from '../../components/common/BasicButton';

function Report({navigation}) {
  const {top} = useSafeAreaInsets();

  const moveToReport = () => {
    Linking.openURL('http://pf.kakao.com/_RrRjxj/chat');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ABDCC1"
        animated={true}
      />
      <View style={{backgroundColor: '#ABDCC1', height: top}} />
      <View style={styles.header}>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.pop();
            }}>
            <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
            {/* <Text style={styles.buttonText}>Back</Text> */}
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton}>
            <TouchableNativeFeedback onPress={() => navigation.pop()}>
              <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
            </TouchableNativeFeedback>
          </View>
        )}
      </View>
      <Text style={styles.title}>Service Center</Text>
      <View style={styles.wrapper}>
        <View style={styles.section}>
          <Text style={styles.bigText}>
            Do you have any questions or inconveniences?
          </Text>
          <Text style={styles.bigText}>
            Memint team will kindly answer your inquiry.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.boldText}>Kakao Talk Channel</Text>
          <Text style={styles.plainText}>
            Weekday 10:00 ~ 19:00 (Weekend, Hoiday off)
          </Text>
        </View>
        <BasicButton
          text="Ask through Kakao Talk"
          width={'100%'}
          height={50}
          textSize={18}
          backgroundColor="#ffffff"
          textColor="#000000"
          margin={[30, 0, 3, 0]}
          borderRadius={10}
          onPress={moveToReport}
          border={false}
        />
      </View>
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
    paddingHorizontal: 15,
    height: 50,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginTop: 20,
    color: '#1D1E1E',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    marginLeft: 15,
  },
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  section: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 30,
  },
  bigText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    marginVertical: 2,
    letterSpacing: -0.5,
    color: '#000000',
  },
  boldText: {
    fontWeight: '700',
    marginBottom: 3,
    color: '#000000',
  },
  plainText: {
    color: '#000000',
  },
  backButton: {
    paddingTop: 5,
  },
});
export default Report;
