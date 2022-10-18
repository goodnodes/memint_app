import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Platform,
  Pressable,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import RNPickerSelect from 'react-native-picker-select';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useToast} from '../../utils/hooks/useToast';
import TagElement from '../../components/meetingComponents/TagElement';
import DoubleModal from '../../components/common/DoubleModal';
import {getUser, updateUserMeetingOut} from '../../lib/Users';
import {deleteMeeting, getMeeting, updateMeeting} from '../../lib/Meeting';
import useUser from '../../utils/hooks/UseUser';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import LinearGradient from 'react-native-linear-gradient';
import useMeetingActions from '../../utils/hooks/UseMeetingActions';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {meetingTags} from '../../assets/docs/contents';
import {notification} from '../../lib/api/notification';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

function EditMeetingInfo({route}) {
  const userInfo = useUser();
  const {rooms} = useMeeting();
  const {saveMeeting} = useMeetingActions();
  const item = route.params.item;
  const [datePicker, setDatePicker] = useState(false);
  const [timePicker, setTimePicker] = useState(false);
  const [submittable, setSubmittable] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState({
    id: item.id,
    title: item.title,
    description: item.description,
    meetDate: new Date(item.meetDate),
    region: item.region,
    peopleNum: item.peopleNum,
    members: item.members,
    meetingTags: item.meetingTags,
  });
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const navigation = useNavigation();
  const {showToast} = useToast();
  const RegionDropDownData = [
    {label: '서울 전체', value: '서울 전체'},
    {label: '강남', value: '강남'},
    {label: '신사', value: '신사'},
    {label: '홍대', value: '홍대'},
    {label: '신촌', value: '신촌'},
    {label: '여의도', value: '여의도'},
    {label: '구로', value: '구로'},
    {label: '신도림', value: '신도림'},
    {label: '혜화', value: '혜화'},
    {label: '안암', value: '안암'},
    {label: '종로', value: '종로'},
    {label: '동대문', value: '동대문'},
    {label: '성수', value: '성수'},
    {label: '이태원', value: '이태원'},
  ];
  const PeopleDropDownData = [
    {label: '2:2', value: 2},
    {label: '3:3', value: 3},
    {label: '4:4', value: 4},
  ];

  useEffect(() => {
    const {title, description, region, peopleNum} = meetingInfo;
    if (title && description && region && peopleNum) {
      setSubmittable(true);
    } else {
      setSubmittable(false);
    }
  }, [meetingInfo]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const getMembers = useCallback(async () => {
    const data = await Promise.all(
      meetingInfo.members.map(async member => {
        const memberId = Object.keys(member)[0];
        const info = await getUser(memberId);
        return info.nickName;
      }),
    );
    setMeetingInfo({...meetingInfo, membersNickName: data});
  }, [meetingInfo]);

  const handleSubmit = () => {
    if (!submittable) {
      showToast('error', '필수 항목들을 작성해주세요');
      return;
    } else if (
      item.title === meetingInfo.title &&
      item.description === meetingInfo.description &&
      new Date(item.meetDate).toString() === meetingInfo.meetDate.toString() &&
      item.region === meetingInfo.region &&
      item.meetingTags === meetingInfo.meetingTags
    ) {
      showToast('error', '변경사항이 없습니다.');
      return;
    } else {
      setConfirmModalVisible(true);
    }
  };

  const handleUpdate = () => {
    updateMeeting(item.id, {
      title: meetingInfo.title,
      description: meetingInfo.description,
      meetDate: meetingInfo.meetDate,
      region: meetingInfo.region,
      peopleNum: meetingInfo.peopleNum,
      meetingTags: meetingInfo.meetingTags,
    })
      .then(() => {
        return getMeeting(item.id);
      })
      .then(res => {
        return getUser(res.data().hostId).then(hostInfo => {
          return {id: item.id, ...res.data(), hostInfo: hostInfo};
        });
      })
      .then(data => {
        setConfirmModalVisible(false);
        showToast('success', '미팅이 수정되었습니다');
        sendNotification();
        navigation.pop();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const sendNotification = () => {
    for (let member of meetingInfo.members) {
      notification({
        receiver: Object.keys(member)[0],
        message: `"${
          meetingInfo.title.length > 10
            ? meetingInfo.title.slice(0, 10) + '...'
            : meetingInfo.title
        }" 미팅의 정보가 변경되었습니다. 확인해보세요!`,
        title: 'MEMINT',
      });
    }
  };

  const handlePeopleNum = value => {
    if (meetingInfo.members.length > value * 2) {
      showToast('error', '참여 인원보다 적은 인원으로 변경할 수 없습니다.');
      return;
    } else {
      setMeetingInfo({...meetingInfo, peopleNum: value});
    }
  };

  const showDatePicker = () => {
    setDatePicker(true);
  };
  const showTimePicker = () => {
    setTimePicker(true);
  };

  const onDateSelected = (event, value) => {
    setMeetingInfo({
      ...meetingInfo,
      meetDate: value,
    });
    setDatePicker(false);
  };
  const onTimeSelected = (event, value) => {
    setMeetingInfo({...meetingInfo, meetDate: value});
    setTimePicker(false);
  };

  return (
    <View style={styles.view}>
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
        <View style={styles.headerBar}>
          <View style={styles.flexRow}>
            <BackButton />
          </View>
          <TouchableOpacity onPress={handleSubmit}>
            <Text
              style={submittable ? styles.completeButton : styles.grayButton}>
              완료
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>미팅 정보 수정하기</Text>
        <DoubleModal
          text="미팅 정보를 수정하시겠습니까?"
          buttonText="네"
          modalVisible={confirmModalVisible}
          setModalVisible={setConfirmModalVisible}
          pFunction={handleUpdate}
          nFunction={() => {
            setConfirmModalVisible(false);
          }}
        />
        <ScrollView style={styles.container}>
          <TextInput
            style={styles.textInputTitle}
            value={meetingInfo.title}
            onChangeText={text => {
              setMeetingInfo({...meetingInfo, title: text});
            }}
            autoComplete="off"
            autoCorrect={false}
            placeholder="제목"
            placeholderTextColor="#EAFFEFCC"
            selectionColor={'#AEFFC1'}
          />
          <View
            style={[
              styles.line,
              meetingInfo.title.length > 0 ? styles.activeLine : null,
            ]}
          />
          <TextInput
            style={styles.textInputDes}
            placeholderTextColor="#EAFFEFCC"
            placeholder="설명"
            value={meetingInfo.description}
            multiline={true}
            onChangeText={text => {
              setMeetingInfo({...meetingInfo, description: text});
            }}
            autoComplete="off"
            autoCorrect={false}
            selectionColor={'#AEFFC1'}
          />
          <View
            style={[
              styles.line,
              meetingInfo.description.length > 0 ? styles.activeLine : null,
            ]}
          />
          <View style={[styles.createElement, styles.flexRow]}>
            <Text style={styles.text}>날짜</Text>
            {Platform.OS === 'ios' ? (
              <RNDateTimePicker
                locale="ko"
                value={meetingInfo.meetDate}
                mode="datetime"
                // textColor="#EAFFEF"
                accentColor="#AEFFC1"
                themeVariant="dark"
                style={styles.datepicker}
                onChange={(event, date) =>
                  setMeetingInfo({...meetingInfo, meetDate: date})
                }
              />
            ) : (
              <View style={styles.datepickerAndroid}>
                {datePicker && (
                  <RNDateTimePicker
                    locale="ko"
                    value={meetingInfo.meetDate}
                    mode="date"
                    // textColor="#EAFFEF"
                    accentColor="#AEFFC1"
                    themeVariant="dark"
                    style={styles.datepicker}
                    onChange={onDateSelected}
                  />
                )}
                {timePicker && (
                  <RNDateTimePicker
                    locale="ko"
                    value={meetingInfo.meetDate}
                    mode="time"
                    display="spinner"
                    // textColor="#EAFFEF"
                    accentColor="#AEFFC1"
                    themeVariant="dark"
                    style={styles.datepicker}
                    onChange={onTimeSelected}
                  />
                )}
                {!datePicker && (
                  <Pressable onPress={showDatePicker}>
                    <Text style={styles.dateText}>
                      {/* {`${
                        meetingInfo.meetDate.getMonth() + 1
                      }월 ${meetingInfo.meetDate.getDate()}일`} */}
                      {meetingInfo.meetDate.toLocaleDateString()}
                    </Text>
                  </Pressable>
                )}
                {!timePicker && (
                  <Pressable onPress={showTimePicker} style={styles.timepicker}>
                    <Text style={styles.dateText}>
                      {meetingInfo.meetDate
                        .toLocaleTimeString('ko-KR')
                        .slice(0, -3)}
                      {/* {`${meetingInfo.meetDate.getHours()}시 ${meetingInfo.meetDate.getMinutes()}분`} */}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
          <View
            style={[
              styles.line,
              meetingInfo.peopleNum ? styles.activeLine : null,
            ]}
          />
          <View style={[styles.createElement, styles.flexRow]}>
            <View style={styles.selectButton}>
              <RNPickerSelect
                placeholder={{label: '지역'}}
                onValueChange={value => {
                  setMeetingInfo({...meetingInfo, region: value});
                }}
                items={RegionDropDownData}
                value={meetingInfo.region}
                fixAndroidTouchableBug={true}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    color: '#ffffff',
                    letterSpacing: -0.5,
                  },
                  inputAndroid: {
                    fontSize: 16,
                    color: '#ffffff',
                    letterSpacing: -0.5,
                    padding: 0,
                  },
                  placeholder: {
                    fontSize: 16,
                    color: '#EAFFEFCC',
                    letterSpacing: -0.5,
                  },
                }}
                Icon={() => {
                  return (
                    <Icon
                      name="arrow-drop-down"
                      size={19}
                      color={'#EAFFEFCC'}
                      style={[
                        styles.icon,
                        Platform.OS === 'android' ? styles.iconAndroid : null,
                      ]}
                    />
                  );
                }}
              />
            </View>
          </View>
          <View
            style={[
              styles.line,
              meetingInfo.peopleNum ? styles.activeLine : null,
            ]}
          />
          <View style={[styles.createElement, styles.flexRow]}>
            <View style={[styles.selectButton, styles.rightMargin]}>
              <RNPickerSelect
                disabled={true}
                placeholder={{label: '인원'}}
                onValueChange={handlePeopleNum}
                items={PeopleDropDownData}
                value={meetingInfo.peopleNum}
                fixAndroidTouchableBug={true}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    color: '#ffffff',
                    letterSpacing: -0.5,
                  },
                  inputAndroid: {
                    fontSize: 16,
                    color: '#ffffff',
                    letterSpacing: -0.5,
                    padding: 0,
                  },
                  placeholder: {
                    fontSize: 16,
                    color: '#EAFFEFCC',
                    letterSpacing: -0.5,
                  },
                }}
                Icon={() => {
                  return (
                    <Icon
                      name="arrow-drop-down"
                      size={19}
                      color={'#EAFFEFCC'}
                      style={[
                        styles.icon,
                        Platform.OS === 'android' ? styles.iconAndroid : null,
                      ]}
                    />
                  );
                }}
              />
            </View>
            <ScrollView style={styles.invitedFriends} horizontal={true}>
              {meetingInfo.membersNickName?.map((el, idx) => (
                <View key={idx} style={styles.invitedFriend}>
                  <Text style={styles.memberText}>{el}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View
            style={[
              styles.line,
              meetingInfo.peopleNum ? styles.activeLine : null,
            ]}
          />
          <View style={styles.tagElement}>
            <Text style={[styles.text, styles.tagTitle]}>태그</Text>
            <View style={styles.tagsContainer}>
              <View style={styles.tagCategory}>
                {/* <Text style={styles.tagCategoryTitle}>분위기</Text> */}
                <View style={styles.tags} horizontal={true}>
                  {meetingTags.map((tag, idx) => (
                    <TagElement
                      key={idx}
                      tag={tag}
                      meetingInfo={meetingInfo}
                      setMeetingInfo={setMeetingInfo}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    alignItems: 'center',
    height: 50,
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    marginLeft: 15,
    marginVertical: 20,
  },
  completeButton: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  grayButton: {
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: -0.5,
    color: 'gray',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createElement: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 60,
  },
  tagElement: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    color: '#EAFFEFCC',
    letterSpacing: -0.5,
  },
  datepicker: {
    width: 230,
  },
  datepickerAndroid: {
    flexDirection: 'row',
  },
  textInputTitle: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    // borderBottomColor: '#EAFFEF',
    // borderBottomWidth: 1,
    height: 60,
    padding: 10,
    fontSize: 16,
    letterSpacing: -0.5,
  },
  textInputDes: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    minHeight: 60,
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 20,
    paddingRight: 10,
    fontSize: 16,
    letterSpacing: -0.5,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagTitle: {
    marginTop: 10,
    marginBottom: 10,
  },
  tagsContainer: {
    marginBottom: 70,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  tagCategoryTitle: {
    marginTop: 5,
    marginBottom: 10,
    color: 'gray',
  },
  tagCategory: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-start',
  },
  invitedFriends: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  invitedFriend: {
    backgroundColor: '#EAFFEFCC',
    padding: 8,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftMargin: {
    marginLeft: 5,
  },
  rightMargin: {
    marginRight: 5,
  },
  deleteButton: {
    marginTop: 15,
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  line: {
    height: 1,
    backgroundColor: '#EAFFEFCC',
  },
  activeLine: {
    backgroundColor: '#AEFFC1',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  icon: {
    position: 'absolute',
  },
  dateText: {
    fontSize: 16,
    color: '#1D1E1E',
    letterSpacing: -0.5,
    lineHeight: 22.4,
    backgroundColor: '#EAFFEFCC',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  timepicker: {
    marginLeft: 10,
  },
  iconAndroid: {
    top: 5,
  },
  memberText: {
    color: '#3D3E44',
  },
});

export default EditMeetingInfo;
