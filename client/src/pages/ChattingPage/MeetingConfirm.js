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
import randomBox from '../../assets/icons/randombox.png';
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
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import ConfirmCameraModal from '../../components/meetingComponents/ConfirmCameraModal';
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
        title: '사진 업로드',
        //사진 선택하기는 이후 삭제될 수 있음
        options: ['카메라로 촬영하기', '취소'],
        cancelButtonIndex: 1,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          onLaunchCamera();
        }
        // else if (buttonIndex === 1) {
        //   onLaunchImageLibrary();
        // }
      },
    );
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
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
    if (loading) {
      return;
    }
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
      return <Text style={styles.subText}>인증 대기중</Text>;
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
              반려 사유: {meetingInfo.confirmMessage}
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
                <Image source={randomBox} style={styles.randomBox} />
                <Text style={styles.buttonText}>
                  클로즈베타 이벤트 참여하기
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
                <TouchableNativeFeedback onPress={goToEventPage}>
                  <View style={styles.eventButton}>
                    <Text style={styles.buttonText}>
                      클로즈베타 이벤트 참여하기
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
              <BasicButton text="인증보내기" onPress={handleSecondSubmit} />
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
                  <Text style={styles.buttonText}>다시 인증하기</Text>
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
                      <Text style={styles.buttonText}>다시 인증하기</Text>
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
                  {meetingInfo?.confirmCreatedAt.toDate().toLocaleString()}
                </Text>
              </View>

              {renderMessage()}
              {renderDenied()}
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
                  <BasicButton text="인증보내기" onPress={handleSubmit} />
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
                  <Text style={styles.buttonText}>미팅 인증샷</Text>
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
                      <Text style={styles.buttonText}>미팅 인증샷</Text>
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
                  {meetingInfo?.confirmCreatedAt
                    .toDate()
                    .toLocaleString('ko-KR')}
                </Text>
              </View>
              {renderMessage()}
            </View>
          ) : (
            <Text style={styles.joinerText}>
              호스트가 이미지를 업로드하지 않았습니다.
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
          {renderEvent()}
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
          <Text style={styles.title}>미팅참여 인증하기</Text>

          <View style={styles.section}>
            <View style={styles.confirmTitleArea}>
              <View style={styles.statusArea}>{renderStatus()}</View>
            </View>

            {renderByUser()}
            <ConfirmCameraModal
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
            <Text style={styles.sectionTitle}>인증 방법 및 주의사항</Text>
            <View style={styles.warningBox}>
              <Text style={styles.boldText}>
                미팅 참여자 전원의 얼굴이 보이게 사진을 찍어주세요!
              </Text>
            </View>
            <View style={styles.guideSection}>
              <Text style={styles.plainText}>
                1. 호스트도 사진에 반드시 포함되어야 합니다.
              </Text>
              <Text style={styles.plainText}>
                2. 다음의 경우에는 스탭의 판단에 따라 인증이 반려됩니다.
              </Text>
              <Text style={styles.subText}>
                • 미팅 구성원 전원이 참석하지 않은 경우
              </Text>
              <Text style={styles.subText}>
                • 음식점이 아닌 것 같다고 판단되는 경우
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
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: -0.5,
    color: '#AEFFC1',
    // marginRight: 3,
    // marginTop: 3,
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
    backgroundColor: '#1D1E1E',
    borderRadius: 99,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingVertical: 13,
    alignItems: 'center',
    marginTop: 15,
    marginRight: 5,
    // marginBottom: 10,
    width: 227,
    height: 28,
    borderColor: '#AEFFC1',
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
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
  },
  memintDino: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  randomBox: {
    // marginTop: 3,
    marginRight: 5,
    width: 18,
    height: 18,
  },
});

export default MeetingConfirm;
