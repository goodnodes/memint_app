import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
} from 'react-native';
import BackButton from '../../components/common/BackButton';
import RNPickerSelect from 'react-native-picker-select';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useToast} from '../../utils/hooks/useToast';
import SingleModal from '../../components/common/SingleModal';
import TagElement from '../../components/meetingComponents/TagElement';
import DoubleModal from '../../components/common/DoubleModal';
import {getUser, updateUserMeetingOut} from '../../lib/Users';
import {getMeetingTags} from '../../lib/MeetingTag';
import {deleteMeeting, getMeeting, updateMeeting} from '../../lib/Meeting';
import useUser from '../../utils/hooks/UseUser';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import LinearGradient from 'react-native-linear-gradient';
import useMeetingActions from '../../utils/hooks/UseMeetingActions';
import SafeStatusBar from '../../components/common/SafeStatusBar';

function EditMeetingInfo({route}) {
  const userInfo = useUser();
  const {rooms} = useMeeting();
  const {saveMeeting} = useMeetingActions();
  const item = route.params.item;
  const [submittable, setSubmittable] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState({
    id: item.id,
    title: item.title,
    description: item.description,
    meetDate: new Date(item.meetDate),
    region: item.region,
    peopleNum: item.peopleNum,
    members: item.members,
    meetingTags: route.params.item.meetingTags,
  });
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [tagData, setTagData] = useState({mood: [], topic: [], alcohol: []});

  const navigation = useNavigation();
  const {showToast} = useToast();
  const RegionDropDownData = [
    {label: '서울 전체', value: '서울 전체'},
    {label: '강남구', value: '강남구'},
    {label: '강동구', value: '강동구'},
    {label: '강북구', value: '강북구'},
    {label: '강서구', value: '강서구'},
    {label: '관악구', value: '관악구'},
    {label: '광진구', value: '광진구'},
    {label: '구로구', value: '구로구'},
    {label: '금천구', value: '금천구'},
    {label: '노원구', value: '노원구'},
    {label: '도봉구', value: '도봉구'},
    {label: '동대문구', value: '동대문구'},
    {label: '동작구', value: '동작구'},
    {label: '마포구', value: '마포구'},
    {label: '서대문구', value: '서대문구'},
    {label: '서초구', value: '서초구'},
  ];
  const PeopleDropDownData = [
    {label: '1:1', value: 1},
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
    getTags();
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

  const getTags = async () => {
    try {
      const res = await getMeetingTags();
      const data = res.docs.reduce(
        (acc, cur) => {
          return {
            ...acc,
            [cur.data().type]: acc[cur.data().type].concat(cur.data().content),
          };
        },
        {mood: [], topic: [], alcohol: []},
      );
      setTagData(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = () => {
    if (!submittable) {
      showToast('error', '필수 항목들을 작성해주세요');
      return;
    } else {
      setConfirmModalVisible(true);
    }
  };

  const handleUpdate = () => {
    try {
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
          // saveMeeting({
          //   ...rooms,
          //   createdrooms: [
          //     data,
          //     ...rooms.createdrooms.filter(el => el.id !== item.id),
          //   ],
          // });
          setConfirmModalVisible(false);
          showToast('success', '미팅이 수정되었습니다');
          navigation.pop();
        })
        .catch(err => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = () => {
    try {
      deleteMeeting(item.id);
      updateUserMeetingOut(userInfo.id, 'createdroomId', item.id);
      showToast('success', '미팅이 삭제되었습니다.');
      navigation.pop();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.view}>
      <SafeStatusBar />
      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 0.3, y: 0.3}}
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
        <SingleModal
          text="미팅 정보를 수정하시겠습니까?"
          buttonText="네"
          modalVisible={confirmModalVisible}
          setModalVisible={setConfirmModalVisible}
          pFunction={handleUpdate}
        />
        <ScrollView style={styles.container}>
          <TextInput
            style={styles.textInputTitle}
            value={meetingInfo.title}
            onChangeText={text => {
              setMeetingInfo({...meetingInfo, title: text});
            }}
            autoComplete={false}
            autoCorrect={false}
            placeholder="제목"
            placeholderTextColor="#EAFFEF"
          />
          <View
            style={[
              styles.line,
              meetingInfo.title.length > 0 ? styles.activeLine : null,
            ]}
          />
          <TextInput
            style={styles.textInputDes}
            placeholderTextColor="#EAFFEF"
            placeholder="설명"
            value={meetingInfo.description}
            multiline={true}
            onChangeText={text => {
              setMeetingInfo({...meetingInfo, description: text});
            }}
            autoComplete={false}
            autoCorrect={false}
          />
          <View
            style={[
              styles.line,
              meetingInfo.description.length > 0 ? styles.activeLine : null,
            ]}
          />
          <View style={[styles.createElement, styles.flexRow]}>
            <Text style={styles.text}>날짜</Text>
            <RNDateTimePicker
              value={meetingInfo.meetDate}
              mode="datetime"
              accentColor="#AEFFC1"
              themeVariant="dark"
              locale="ko"
              style={styles.datepicker}
              onChange={(event, date) =>
                setMeetingInfo({...meetingInfo, meetDate: date})
              }
            />
          </View>
          <View style={[styles.createElement, styles.flexRow]}>
            <TouchableOpacity style={styles.selectButton}>
              <RNPickerSelect
                placeholder={{label: '지역'}}
                onValueChange={value => {
                  setMeetingInfo({...meetingInfo, region: value});
                }}
                items={RegionDropDownData}
                value={meetingInfo.region}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    color: '#ffffff',
                    letterSpacing: -0.5,
                  },
                  placeholder: {
                    fontSize: 16,
                    color: '#EAFFEF',
                    letterSpacing: -0.5,
                  },
                }}
                Icon={() => {
                  return (
                    <Icon
                      name="arrow-drop-down"
                      size={19}
                      color={'#EAFFEF'}
                      style={styles.icon}
                    />
                  );
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.createElement, styles.flexRow]}>
            <TouchableOpacity style={[styles.selectButton, styles.rightMargin]}>
              <RNPickerSelect
                placeholder={{label: '인원'}}
                onValueChange={value => {
                  setMeetingInfo({...meetingInfo, peopleNum: value});
                }}
                items={PeopleDropDownData}
                value={meetingInfo.peopleNum}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    color: '#ffffff',
                    letterSpacing: -0.5,
                  },
                  placeholder: {
                    fontSize: 16,
                    color: '#EAFFEF',
                    letterSpacing: -0.5,
                  },
                }}
              />
              <Icon name="arrow-drop-down" size={19} color={'gray'} />
            </TouchableOpacity>
            <ScrollView style={styles.invitedFriends} horizontal={true}>
              {meetingInfo.membersNickName?.map((el, idx) => (
                <View key={idx} style={styles.invitedFriend}>
                  <Text>{el}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.tagElement}>
            <Text style={[styles.text, styles.tagTitle]}>태그</Text>
            <View style={styles.tagsContainer}>
              <View style={styles.tagCategory}>
                {/* <Text style={styles.tagCategoryTitle}>분위기</Text> */}
                <View style={styles.tags} horizontal={true}>
                  {tagData.mood.map((tag, idx) => (
                    <TagElement
                      key={idx}
                      tag={tag}
                      meetingInfo={meetingInfo}
                      setMeetingInfo={setMeetingInfo}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.tagCategory}>
                {/* <Text style={styles.tagCategoryTitle}>주제</Text> */}
                <View style={styles.tags} horizontal={true}>
                  {tagData.topic.map((tag, idx) => (
                    <TagElement
                      key={idx}
                      tag={tag}
                      meetingInfo={meetingInfo}
                      setMeetingInfo={setMeetingInfo}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.tagCategory}>
                {/* <Text style={styles.tagCategoryTitle}>술</Text> */}
                <View style={styles.tags} horizontal={true}>
                  {tagData.alcohol.map((tag, idx) => (
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
          {/* <View style={styles.deleteButton}>
            <Button
              onPress={() => {
                setDeleteModalVisible(true);
              }}
              title="미팅 삭제하기"
              color="#DA6262"
            />
          </View> */}
          {/* <DoubleModal
            text="미팅룸 삭제 후 복구가 불가합니다. 삭제하시겠습니까?"
            nButtonText="네"
            pButtonText="아니오"
            modalVisible={deleteModalVisible}
            setModalVisible={setDeleteModalVisible}
            pFunction={() => {
              setDeleteModalVisible(false);
            }}
            nFunction={handleDelete}
          /> */}
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
    color: '#EAFFEF',
    letterSpacing: -0.5,
  },
  datepicker: {
    width: 230,
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
  },
  invitedFriend: {
    backgroundColor: '#EAFFEF',
    padding: 8,
    marginHorizontal: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
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
    backgroundColor: '#EAFFEF',
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
});

export default EditMeetingInfo;
