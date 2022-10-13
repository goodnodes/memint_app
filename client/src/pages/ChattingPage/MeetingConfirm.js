import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActionSheetIOS,
  Platform,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  TouchableNativeFeedback,
  StatusBar,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import memintDino from '../../assets/icons/memintDino.png';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import useUser from '../../utils/hooks/UseUser';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {getMeeting, updateMeeting} from '../../lib/Meeting';
import BasicButton from '../../components/common/BasicButton';
import {createConfirmAlarm} from '../../lib/Alarm';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import LinearGradient from 'react-native-linear-gradient';
import {makeCreateDiscord} from '../../lib/api/notification';
import CameraModal from '../../components/AuthComponents/CameraModal';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
const window = Dimensions.get('window');

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

function MeetingConfirm({route}) {
  const [meetingInfo, setMeetingInfo] = useState(route.params.meetingInfo);
  const [refreshing, setRefreshing] = useState(true);
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const userInfo = useUser();
  const navigation = useNavigation();
  // const {meetingInfo} = route.params;

  useEffect(() => {
    getMeetingInfo();
  }, []);

  const getMeetingInfo = async () => {
    const res = await getMeeting(route.params.meetingInfo.id);
    setMeetingInfo({id: res.id, ...res.data()});
    setRefreshing(false);
  };

  const imagePickerOption = {
    mediaType: 'photo',
    maxWidth: 768,
    maxHeight: 768,
    includeBase64: Platform.OS === 'android',
  };

  const onPickImage = res => {
    if (res.didCancel || !res) {
      return;
    }
    setImage(res);
  };
  const goToEventPage = () => {
    navigation.navigate('EventPage', {meetingInfo: meetingInfo});
  };
  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };
  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const handleCamera = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
      return;
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'Upload Picture',
        //사진 선택하기는 이후 삭제될 수 있음
        options: ['Take Photo', 'Choose From Library', 'Cancel'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          onLaunchCamera();
        } else if (buttonIndex === 1) {
          onLaunchImageLibrary();
        }
      },
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    let photoURL = null;
    const asset = image.assets[0];
    const extension = asset.fileName.split('.').pop(); //확장자 추출
    const reference = storage().ref(`/meeting/${meetingInfo.id}.${extension}`);

    await reference.putFile(asset.uri);

    photoURL = image ? await reference.getDownloadURL() : null;
    await updateMeeting(meetingInfo.id, {
      confirmImage: photoURL,
      confirmStatus: 'pending',
      confirmCreatedAt: firestore.FieldValue.serverTimestamp(),
    });
    await createConfirmAlarm({sender: userInfo.id, meetingId: meetingInfo.id});
    await makeCreateDiscord({sender: userInfo.nickName});
    await getMeetingInfo();
    setImage(null);
    setLoading(false);
  };

  const handleSecondSubmit = async () => {
    setLoading(true);
    const existedReference = storage().refFromURL(meetingInfo.confirmImage);
    await existedReference.delete();
    let photoURL = null;
    const asset = image.assets[0];
    const extension = asset.fileName.split('.').pop(); //확장자 추출
    const reference = storage().ref(`/meeting/${meetingInfo.id}.${extension}`);

    if (Platform.OS === 'android') {
      await reference.putString(asset.base64, 'base64', {
        contentType: asset.type,
      });
    } else {
      await reference.putFile(asset.uri);
    }

    photoURL = image ? await reference.getDownloadURL() : null;
    await updateMeeting(meetingInfo.id, {
      confirmImage: photoURL,
      confirmStatus: 'pending',
      confirmCreatedAt: firestore.FieldValue.serverTimestamp(),
    });
    await createConfirmAlarm({sender: userInfo.id, meetingId: meetingInfo.id});
    await makeCreateDiscord({sender: userInfo.nickName});
    await getMeetingInfo();
    setImage(null);
    setLoading(false);
  };

  const renderStatus = () => {
    if (meetingInfo.confirmStatus === 'pending') {
      return <Text style={styles.subText}>Wating for verification</Text>;
    }
    // } else if (meetingInfo.confirmStatus === 'confirmed') {
    //   return (
    //     <>
    //       <Text style={styles.plainText}>인증 완료</Text>
    //       <Icon
    //         name="check-circle"
    //         size={15}
    //         color="#00BA00"
    //         style={styles.statusIcon}
    //       />
    //     </>
    //   );
    // } else if (meetingInfo.confirmStatus === 'denied') {
    //   return (
    //     <>
    //       <Text style={styles.plainText}>인증 반려</Text>
    //       <Icon
    //         name="warning"
    //         size={15}
    //         color="#EE404C"
    //         style={styles.statusIcon}
    //       />
    //     </>
    //   );
    // }
  };

  const renderMessage = () => {
    if (meetingInfo.confirmMessage) {
      if (meetingInfo.confirmStatus === 'confirmed') {
        return (
          <View style={styles.messageArea}>
            <Image source={memintDino} style={styles.memintDino} />
            <Text style={styles.plainText}>{meetingInfo.confirmMessage}</Text>
          </View>
        );
      } else if (meetingInfo.confirmStatus === 'denied') {
        return (
          <View style={styles.messageArea}>
            <Icon
              name="warning"
              size={15}
              style={styles.messageIcon}
              color="#EE404C"
            />
            <Text style={styles.warningText}>
              rejection | {meetingInfo.confirmMessage}
            </Text>
          </View>
        );
      }
    }
  };

  const renderEvent = () => {
    if (meetingInfo.confirmMessage) {
      if (
        meetingInfo.confirmStatus === 'confirmed' &&
        meetingInfo.hostId === userInfo.id
      ) {
        return (
          <View>
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={styles.eventButton}
                onPress={goToEventPage}>
                <Text style={styles.buttonText}>Get an event prize!</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <TouchableNativeFeedback onPress={goToEventPage}>
                  <View style={styles.eventButton}>
                    <Text style={styles.buttonText}>
                      Click to get the event prize!
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            )}
          </View>
        );
      }
    }
  };

  const renderDenied = () => {
    if (meetingInfo.confirmStatus === 'denied') {
      return (
        <>
          {image ? (
            <View style={styles.imageView}>
              <Image
                source={{uri: image?.assets[0]?.uri}}
                style={styles.image}
              />
              <BasicButton text="Send Photo" onPress={handleSecondSubmit} />
            </View>
          ) : (
            <View style={styles.deniedArea}>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={handleCamera}>
                  <Icon
                    name="photo-camera"
                    size={25}
                    style={styles.photoIcon}
                    color="#33ED96"
                  />
                  <Text style={styles.buttonText}>Send again</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <TouchableNativeFeedback onPress={handleCamera}>
                    <View style={styles.photoButton}>
                      <Icon
                        name="photo-camera"
                        size={25}
                        style={styles.photoIcon}
                        color="#33ED96"
                      />
                      <Text style={styles.buttonText}>Send again</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )}
            </View>
          )}
        </>
      );
    }
  };

  const renderByUser = () => {
    if (meetingInfo.hostId === userInfo.id) {
      return (
        <>
          {meetingInfo.confirmImage ? (
            <View style={styles.imageView}>
              <Image
                source={{uri: meetingInfo.confirmImage}}
                style={[
                  styles.image,
                  meetingInfo.confirmStatus &&
                  meetingInfo.confirmStatus === 'confirmed'
                    ? {borderWidth: 3, borderColor: '#58FF7D'}
                    : null,
                  meetingInfo.confirmStatus &&
                  meetingInfo.confirmStatus === 'denied'
                    ? {borderWidth: 3, borderColor: '#F52C00'}
                    : null,
                ]}
              />
              <View style={styles.dateText}>
                <Text style={styles.plainText}>
                  {meetingInfo?.confirmCreatedAt.toDate().toLocaleString('en')}
                </Text>
              </View>

              {renderMessage()}
              {renderDenied()}
              {renderEvent()}
            </View>
          ) : (
            <>
              {image ? (
                <View style={styles.imageView}>
                  <Image
                    resizeMode="contain"
                    source={{uri: image?.assets[0]?.uri}}
                    style={styles.image}
                  />
                  <BasicButton text="Send Photo" onPress={handleSubmit} />
                </View>
              ) : Platform.OS === 'ios' ? (
                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={handleCamera}>
                  <Icon
                    name="photo-camera"
                    size={25}
                    style={styles.photoIcon}
                    color="#33ED96"
                  />
                  <Text style={styles.buttonText}>Upload Photo</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <TouchableNativeFeedback onPress={handleCamera}>
                    <View style={styles.photoButton}>
                      <Icon
                        name="photo-camera"
                        size={25}
                        style={styles.photoIcon}
                        color="#33ED96"
                      />
                      <Text style={styles.buttonText}>Upload Photo</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )}
            </>
          )}
        </>
      );
    } else {
      return (
        <View>
          {meetingInfo.confirmImage ? (
            <View style={styles.imageView}>
              <Image
                resizeMode="contain"
                source={{uri: meetingInfo.confirmImage}}
                style={[
                  styles.image,
                  meetingInfo.confirmStatus &&
                  meetingInfo.confirmStatus === 'confirmed'
                    ? {borderWidth: 3, borderColor: '#58FF7D'}
                    : null,
                  meetingInfo.confirmStatus &&
                  meetingInfo.confirmStatus === 'denied'
                    ? {borderWidth: 3, borderColor: '#F52C00'}
                    : null,
                ]}
              />
              <View style={styles.dateText}>
                <Text style={styles.plainText}>
                  {meetingInfo?.confirmCreatedAt.toDate().toLocaleString('en')}
                </Text>
              </View>
              {renderMessage()}
            </View>
          ) : (
            <Text style={styles.joinerText}>
              The host didn't upload the photo.
            </Text>
          )}
        </View>
      );
    }
  };

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
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 1, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        <View style={styles.header}>
          <BackButton />
        </View>
        <ScrollView
          contentContainerStyle={{paddingBottom: 30}}
          style={styles.wrapper}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={getMeetingInfo}
            />
          }>
          <Text style={styles.title}>Verification</Text>

          <View style={styles.section}>
            <View style={styles.confirmTitleArea}>
              <View style={styles.statusArea}>{renderStatus()}</View>
            </View>

            {renderByUser()}
            <CameraModal
              text="미팅을 생성하시겠습니까?"
              //body={<Text>정말로?</Text>}
              nButtonText="아니요"
              pButtonText="네"
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              pFunction={() => {}}
              nFunction={() => {
                setModalVisible(!modalVisible);
              }}
              onLaunchCamera={onLaunchCamera}
              onLaunchImageLibrary={onLaunchImageLibrary}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Verification methods and precautions
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.boldText}>
                Please take a photo to show the faces of all participants in the
                group dating!
              </Text>
            </View>
            <View style={styles.guideSection}>
              <Text style={styles.plainText}>
                1. The host must also be included in the photo.
              </Text>
              <Text style={styles.plainText}>
                2. In the following cases, the verification will be rejected at
                the discretion of the staff.
              </Text>
              <Text style={styles.subText}>
                • All of the meeting members are not present
              </Text>
              <Text style={styles.subText}>
                • Judging that it doesn't see2m like a restaurant
              </Text>
            </View>
          </View>
        </ScrollView>
        {loading ? (
          <ActivityIndicator style={styles.loading} size="large" />
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    letterSpacing: -0.5,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
  },
  wrapper: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  warningBox: {
    backgroundColor: '#rgba(234, 255, 239, 0.8)',
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 20,
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 15,
  },
  boldText: {
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: -0.5,
    color: '#1D1E1E',
    textAlign: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: -0.5,
    color: '#1D1E1E',
    marginRight: 3,
  },
  plainText: {
    fontSize: 13,
    marginVertical: 5,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  bigText: {
    fontSize: 12.5,
    letterSpacing: -0.5,
    marginTop: 10,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    letterSpacing: -0.5,
    fontWeight: '500',
  },
  guideSection: {
    marginHorizontal: 25,
  },
  subText: {
    color: '#ffffff',
    fontSize: 13,
    letterSpacing: -0.5,
    marginTop: 5,
  },
  photoButton: {
    backgroundColor: '#ffffff',
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 13,
    alignContent: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    height: 50,
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },
  photoIcon: {
    marginRight: 7,
  },
  eventButton: {
    backgroundColor: '#AEFFC1',
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 13,
    alignContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    height: 50,
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },
  imageView: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  image: {
    height: 280,
    width: '100%',
  },
  deniedArea: {
    width: '100%',
  },
  confirmTitleArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  statusArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginLeft: 3,
  },
  messageArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 5,
  },
  messageIcon: {
    marginRight: 5,
  },
  warningText: {
    fontSize: 13,
    letterSpacing: -0.5,
    color: '#EE404C',
  },
  loading: {
    position: 'absolute',
    top: window.height / 2.2,
    left: window.width / 2.25,
    zIndex: 3,
    color: 'light-gray',
  },
  joinerText: {
    color: '#ffffff',
    marginBottom: 10,
  },
  dateText: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    width: '100%',
  },
  header: {
    height: 50,
    justifyContent: 'center',
  },
  memintDino: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
});

export default MeetingConfirm;
