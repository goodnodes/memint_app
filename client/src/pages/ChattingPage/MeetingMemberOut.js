import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../../components/common/BackButton';
import BasicButton from '../../components/common/BasicButton';
import CheckBox from '@react-native-community/checkbox';
import useUser from '../../utils/hooks/UseUser';
import {memberOut} from '../../lib/Meeting';
import DoubleModal from '../../components/common/DoubleModal';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useToast} from '../../utils/hooks/useToast';
import {createMeetingBanned} from '../../lib/Alarm';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

function MeetingMemberOut({route}) {
  const {showToast} = useToast();
  const navigation = useNavigation();
  const user = useUser();
  const [modalVisible, setModalVisible] = useState('');
  const [form, setForm] = useState({
    sender: user.id,
    receiver: '',
    nickName: '',
    text: '',
  });
  const member = route.params.data
    .filter(el => {
      return el[2] !== user.id;
    })
    .map((el, idx) => {
      console.log(el);
      return <Person user={el} key={idx} form={form} setForm={setForm} />;
    });

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <SafeStatusBar />
      ) : (
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor="#3D3E44"
          animated={true}
        />
      )}
      <View style={styles.header}>
        <BackButton />
      </View>
      <Text style={styles.title}>미팅 멤버 내보내기</Text>
      <View style={styles.wrapper}>
        <KeyboardAwareScrollView style={{width: '100%'}}>
          <View style={styles.warningBox}>
            <Icon name="error-outline" size={20} color="#58FF7D" />
            <Text style={styles.boldText}>
              멤버 퇴출은 다음의 경우에만 진행해 주세요.
            </Text>
            <View>
              <Text style={styles.plainText}>
                •{'  '}채팅방 내 타인을 모욕하거나 비방
              </Text>
              <Text style={styles.plainText}>
                •{'  '}음란물, 불법 사행성 도박 사이트 홍보 메시지 발송
              </Text>
              <Text style={styles.plainText}>
                •{'  '}불법촬영물, 허위영상물, 아동・청소년 성착취물 공유
              </Text>
              <Text style={styles.plainText}>
                •{'  '}타인의 개인정보 유출 및 권리침해
              </Text>
              <Text style={styles.plainText}>•{'  '}장기간 미응답</Text>
              <Text style={styles.plainText}>•{'  '}기타 특이사항</Text>
            </View>
            <Text style={styles.bigText}>
              ※{'  '}잦은 멤버 퇴출은 이용제한조치 사유가 될 수 있습니다.
            </Text>
          </View>
          <View style={styles.selectSection}>{member}</View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              멤버 내보내기 사유를 작성해 주세요.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="퇴출 사유를 구체적으로 적어주세요"
              multiline={true}
              value={form.text}
              onChangeText={text => {
                setForm({...form, text});
              }}
              selectionColor={'#AEFFC1'}
            />
          </View>
          {/* <View style={styles.memberoutButton}>
        <BasicButton
          text="내보내기"
          width={'100%'}
          height={50}
          textSize={18}
          backgroundColor={form.receiver && form.text ? '#58FF7D' : 'gray'}
          textColor="#000000"
          margin={[30, 3, 3, 3]}
          borderRadius={10}
          onPress={() => {
            form.receiver && form.text && setModalVisible(true);
          }}
          border={false}
        />
        </View> */}
        </KeyboardAwareScrollView>
        <Pressable
          style={styles.memberoutButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={{color: '#1D1E1E', fontSize: 18, fontWeight: '600'}}>
            완료
          </Text>
        </Pressable>
      </View>

      <DoubleModal
        text={`${form.nickName} \n님을 내보내시겠습니까?`}
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pFunction={() => {
          memberOut(
            route.params.meetingData.id,
            route.params.meetingData.members,
            form.receiver,
            route.params.meetingData.status,
            form.nickName,
          )
            .then(() => {
              createMeetingBanned({
                sender: form.sender,
                receiver: form.receiver,
                meetingId: route.params.meetingData.id,
              });
            })
            .then(() => {
              navigation.navigate('ChattingListPage');
              showToast('success,', `${form.nickName} 님을 내보내셨습니다.`);
            });
        }}
        nFunction={() => {
          setModalVisible(!modalVisible);
        }}
      />
    </View>
  );
}

const Person = ({user, form, setForm}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: user[1]}}
          style={{width: 30, height: 30, borderRadius: 999}}
        />
        <Text
          style={{
            fontSize: 17,
            fontWeight: '500',
            paddingLeft: 8,
            color: '#ffffff',
          }}>
          {user[0]}
        </Text>
      </View>
      <CheckBox
        value={form.receiver === user[2]}
        onChange={() =>
          form.receiver === user[2]
            ? setForm({...form, receiver: '', nickName: ''})
            : setForm({
                ...form,
                receiver: user[2],
                nickName: user[0],
              })
        }
        animationDuration={0.1}
        offAnimationType="fade"
        onCheckColor="#58FF7D"
        onTintColor="#58FF7D"
        tintColors={{true: '#58FF7D'}}
        style={{width: 20, height: 20, marginRight: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3C3D43',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 32,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    marginLeft: 15,
  },
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 15,
  },
  warningBox: {
    borderRadius: 20,
    width: '100%',
    paddingBottom: 23,
    flexDirection: 'column',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: -0.5,
    marginTop: 8,
    marginBottom: 15,
    color: '#ffffff',
  },
  plainText: {
    fontSize: 14,
    marginVertical: 1,
    color: '#ffffff',
    lineHeight: 19.6,
    letterSpacing: -0.5,
  },
  bigText: {
    fontSize: 14,
    marginTop: 7,
    color: '#ffffff',
    lineHeight: 19.6,
    letterSpacing: -0.5,
  },
  selectSection: {
    width: '100%',
    marginTop: 45,
    marginBottom: 22,
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    letterSpacing: -0.5,
    fontWeight: '500',
    lineHeight: 22.4,
    marginBottom: 3,
    color: '#ffffff',
  },
  userElement: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  textInput: {
    borderRadius: 5,
    marginVertical: 10,
    height: 80,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#EAFFEFCC',
    color: '#3D3E44',
  },
  memberoutButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },
});

export default MeetingMemberOut;
