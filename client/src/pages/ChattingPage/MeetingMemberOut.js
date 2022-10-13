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
      <Text style={styles.title}>Export Member</Text>
      <View style={styles.wrapper}>
        <KeyboardAwareScrollView
          style={{width: '100%'}}
          contentContainerStyle={{paddingBottom: 90}}>
          <View style={styles.warningBox}>
            <Icon name="error-outline" size={20} color="#58FF7D" />
            <Text style={styles.boldText}>
              Please proceed with the withdrawal of the members only in the
              following cases.
            </Text>
            <View>
              <Text style={styles.plainText}>
                •{'  '}Insult or slander others in the chatting room
              </Text>
              <Text style={styles.plainText}>
                •{'  '}Sending pornography, illegal gambling sites, and
                promotional messages
              </Text>
              <Text style={styles.plainText}>
                •{'  '}Sharing illegal filming, false video, and sexual
                exploitation of children and adolescents
              </Text>
              <Text style={styles.plainText}>
                •{'  '}Leakage of personal information and infringement of
                rights of others
              </Text>
              <Text style={styles.plainText}>
                •{'  '}Long-term unresponsive
              </Text>
              <Text style={styles.plainText}>
                •{'  '}In other unusual cases
              </Text>
            </View>
            <Text style={styles.bigText}>
              ※{'  '}Frequent withdrawal of members can be a reason for
              restrictions on use.
            </Text>
          </View>
          <View style={styles.selectSection}>{member}</View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Please write the reason for sending the member out.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Please write the reason specifically"
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
            Submit
          </Text>
        </Pressable>
      </View>

      <DoubleModal
        text={`Are you sure you want to export ${form.nickName}?`}
        nButtonText="No"
        pButtonText="Yes"
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
              showToast('success,', `${form.nickName} has been kicked out.`);
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
