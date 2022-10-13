import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import useUser from '../../utils/hooks/UseUser';
import {useToast} from '../../utils/hooks/useToast';
import RoomHeader from '../../components/chattingComponents/roomHeader';
import knowmore from '../../assets/icons/knowmore.png';
import befriend from '../../assets/icons/befriend.png';
import fallinlove from '../../assets/icons/fallinlove.png';
import soso from '../../assets/icons/soso.png';
import notgood from '../../assets/icons/notgood.png';
import terrible from '../../assets/icons/terrible.png';
import DoubleModal from '../../components/common/DoubleModal';
import {sendFeedback} from '../../lib/Meeting';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import {notification} from '../../lib/api/notification';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/common/BackButton';
import {ScrollView} from 'react-native-gesture-handler';
import {calculateCharm} from '../../lib/Users';

function FeedbackSendPage({route}) {
  const owner = useUser();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const {person, data, userInfo} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    sender: owner.id,
    receiver: person[2],
    emotion: '',
    message: '',
    visible: true,
  });

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#3D3E44'}}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeStatusBar />
      <View style={styles.header}>
        <BackButton />
      </View>
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 1, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <Text style={styles.title}>Feedback </Text>

        <View style={styles.wrapper}>
          {/* <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 30}}>
              {`${person[0]}님께 후기를 작성해주세요.`}
            </Text> */}
          <ScrollView
            style={styles.container}
            contentContainerStyle={{paddingBottom: 50}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: person[1]}}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 999,
                  marginRight: 8,
                }}
              />
              <Text style={styles.name}>{person[0]}</Text>
            </View>
            <View style={styles.emotions}>
              <Emotion
                uri={knowmore}
                state="knowmore"
                text="We need more talk"
                form={form}
                setForm={setForm}
              />
              <Emotion
                uri={befriend}
                state="befriend"
                text="Wanna be a friend"
                form={form}
                setForm={setForm}
              />
              <Emotion
                uri={fallinlove}
                state="fallinlove"
                text="I'm in love"
                form={form}
                setForm={setForm}
              />
            </View>
            <View style={{...styles.emotions}}>
              <Emotion
                uri={soso}
                state="soso"
                text="It wasn't bad"
                form={form}
                setForm={setForm}
              />
              <Emotion
                uri={notgood}
                state="notgood"
                text="I didn't like it"
                form={form}
                setForm={setForm}
              />
              <Emotion
                uri={terrible}
                state="terrible"
                text="Uncomfortable"
                form={form}
                setForm={setForm}
              />
            </View>
            <View style={styles.message}>
              <Text style={{fontSize: 16, fontWeight: '500', color: '#ffffff'}}>
                A message to {person[0]}
              </Text>
              <TextInput
                multiline={true}
                style={styles.textInput}
                placeholder="Express your feelings!"
                placeholderTextColor="#1D1E1E"
                textAlignVertical="top"
                value={form.message}
                maxLength={100}
                onChangeText={text => {
                  setForm({...form, message: text});
                }}
                selectionColor={'#AEFFC1'}></TextInput>
              <Text
                style={{
                  fontWeight: '500',
                  position: 'absolute',
                  right: 10,
                  bottom: 10,
                  color: '#EAEAEA',
                }}>
                {form.message.length} / 100
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 7,
                marginBottom: 30,
              }}>
              <Pressable
                onPress={() => {
                  setForm({
                    ...form,
                    visible: !form.visible,
                  });
                }}>
                <Icon
                  style={{opacity: 1, marginTop: 10}}
                  name="check-circle-outline"
                  size={20}
                  color={form.visible ? '#ffffff' : '#58FF7D'}
                />
              </Pressable>
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 14,
                  color: '#ffffff',
                  marginTop: 12,
                }}>
                Don't send it to {person[0]}
              </Text>
            </View>
          </ScrollView>
          <Pressable
            style={styles.confirmButton}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Text
              style={{
                color: '#1D1E1E',
                fontSize: 18,
                fontWeight: '600',
                lineHeight: 22,
                letterSpacing: -1,
              }}>
              Send
            </Text>
          </Pressable>
        </View>
        <DoubleModal
          text={`Would you like to send a feedback?`}
          nButtonText="No"
          pButtonText="Yes"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          pFunction={() => {
            sendFeedback(data.id, person[2], owner.id, form).then(async () => {
              if (form.visible === true) {
                console.log('good');
                await firestore()
                  .collection('User')
                  .doc(person[2])
                  .collection('Alarm')
                  .add({
                    type: 'feedback',
                    sender: owner.id,
                    message: form.message,
                    createdAt: firestore.Timestamp.now(),
                    meetingId: data.id,
                    emotion: form.emotion,
                  });
                notification({
                  receiver: person[2],
                  message: 'Feedback message has arrived.',
                  title: 'MEMINT',
                });
                calculateCharm(person[2], form.emotion);
              }
              showToast('success', 'Feedback has been sent.');
              navigation.navigate('FeedbackChoicePage', {data, userInfo});
            });
          }}
          nFunction={() => {
            setModalVisible(!modalVisible);
          }}
        />
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function Emotion({uri, text, state, form, setForm}) {
  return (
    <Pressable
      style={styles.emotion}
      onPress={() => {
        setForm({
          ...form,
          emotion: state,
        });
      }}>
      <Image
        source={uri}
        style={[
          styles.image,
          form.emotion === state
            ? {
                shadowColor: '#fff',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }
            : {tintColor: '#EAFFEFCC'},
        ]}
      />
      <Text
        style={[
          {marginTop: 10, fontSize: 12, letterSpacing: -0.5},
          {color: form.emotion === state ? '#58FF7D' : '#EAFFEFCC'},
        ]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 24,
    letterSpacing: -0.5,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  emotions: {
    width: '100%',
    height: 80,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  emotion: {
    alignItems: 'center',
    width: 100,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
    resizeMode: 'contain',
    overflow: 'visible',
    tintColor: '#58FF7D',
  },
  message: {
    marginTop: 30,
    width: '100%',
    height: 150,
  },
  textInput: {
    backgroundColor: '#EAFFEFCC',
    width: '100%',
    height: 120,
    borderWidth: 0.3,
    borderRadius: 7,
    fontSize: 15,
    marginVertical: 13,
    padding: 10,
    paddingTop: 15,
  },
  confirmButton: {
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
  header: {
    height: 50,
    justifyContent: 'center',
  },
});

export default FeedbackSendPage;
