import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BasicButton from '../../components/common/BasicButton';

function Report({navigation}) {
  const {top} = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={{backgroundColor: '#ABDCC1', height: top}} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.pop()}>
          <Icon name="arrow-back-ios" size={20} color={'#1D1E1E'} />
          {/* <Text style={styles.buttonText}>Back</Text> */}
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>고객센터</Text>
      <View style={styles.wrapper}>
        <View style={styles.section}>
          <Text style={styles.bigText}>
            궁금하시거나 불편한 점이 있으신가요?
          </Text>
          <Text style={styles.bigText}>
            문의사항에 대해 친절히 답변해 드리겠습니다.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.boldText}>카카오톡 문의</Text>
          <Text>평일 10:00 ~ 19:00 (토, 일, 공휴일 휴무)</Text>
        </View>
        <BasicButton
          text="카카오톡으로 문의하기"
          width={332}
          height={50}
          textSize={18}
          backgroundColor="#ffffff"
          textColor="#000000"
          margin={[30, 3, 3, 3]}
          borderRadius={10}
          onPress={() => {}}
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
  },
  boldText: {
    fontWeight: '700',
    marginBottom: 3,
  },
  backButton: {
    paddingTop: 5,
  },
});
export default Report;
