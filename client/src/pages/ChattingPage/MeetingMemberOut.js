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
      // console.log(el);
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
        <View style={styles.warningBox}>
          <Icon name="error-outline" size={30} color="red" />
          <Text style={styles.boldText}>
            멤버 퇴출은 다음의 경우에만 진행해 주세요.
          </Text>
          <View>
            <Text style={styles.plainText}>• 채팅방 내 타인을 모욕, 비방</Text>
            <Text style={styles.plainText}>
              • 음란물, 불법 사행성 도박 사이트 홍보 메시지 발송
            </Text>
            <Text style={styles.plainText}>
              • 불법촬영물, 허위영상물, 아동 ・ 청소년 성착취물 공유
            </Text>
            <Text style={styles.plainText}>
              • 타인의 개인정보 유출 및 권리침해
            </Text>
            <Text style={styles.plainText}>• 장기간 미응답</Text>
            <Text style={styles.plainText}>• 기타 특이사항</Text>
          </View>
          <Text style={styles.bigText}>
            ※ 잦은 멤버 퇴출은 이용제한조치 사유가 될 수 있습니다.
          </Text>
        </View>
        <View style={styles.selectSection}>{member}</View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>퇴출 사유</Text>
          <TextInput
            style={styles.textInput}
            placeholder="퇴출 사유를 구체적으로 적어주세요"
            multiline={true}
            value={form.text}
            onChangeText={text => {
              setForm({...form, text});
            }}
          />
        </View>
        <BasicButton
          text="내보내기"
          width={332}
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
          style={{width: 45, height: 45, borderRadius: 22.5}}
        />
        <Text
          style={{
            fontSize: 17,
            fontWeight: 'bold',
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
    marginVertical: 20,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    marginLeft: 15,
  },
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  warningBox: {
    borderColor: '#AEFFC1',
    borderWidth: 1,
    borderRadius: 20,
    width: '100%',
    paddingHorizontal: 30,
    paddingTop: 15,
    paddingBottom: 23,
    flexDirection: 'column',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '700',
    fontSize: 15,
    marginVertical: 15,
    color: '#ffffff',
  },
  plainText: {
    fontSize: 12.2,
    marginVertical: 0.5,
    color: '#ffffff',
  },
  bigText: {
    fontSize: 12.5,
    marginTop: 10,
    color: '#ffffff',
  },
  selectSection: {
    width: '100%',
    marginVertical: 30,
    paddingHorizontal: 10,
  },
  section: {
    width: '100%',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
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
    borderRadius: 10,
    borderColor: '#AEFFC1',
    borderWidth: 1,
    marginVertical: 10,
    height: 80,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#ffffff',
  },
});

export default MeetingMemberOut;
