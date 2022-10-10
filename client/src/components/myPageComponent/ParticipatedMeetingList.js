import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

import DoubleModal from '../../components/common/DoubleModal';
import {changeJoinerToConfirmed, getMeeting} from '../../lib/Meeting';
import {getUser} from '../../lib/Users';
import {handleDateInFormat} from '../../utils/common/Functions';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import useMeetingActions from '../../utils/hooks/UseMeetingActions';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import EarnModal from '../common/UserInfoModal/EarnModal';
import MeetingLikes from '../meetingComponents/MeetingLikes';

// function ParticipatedMeetingList({List}) {
//   return (
//     <>1
//       <FlatList
//         data={List}
//         renderItem={({item}) => <ParticipatedMeetings item={item} />}
//       />
//     </>
//   );
// }

const {width} = Dimensions.get('window');

function ParticipatedMeetingList({user}) {
  const meetingData = useMeeting();
  const {saveMeeting} = useMeetingActions();
  const [joinedRoom, setJoinedRoom] = useState([]);
  useEffect(() => {
    getJoinedRoom();
    // setJoinedRoom(
    //   user.joinedroomId?.map(el => {
    //     //내가 가지고 있는 아이디
    //     const meetingInfo = meetingData.filter(meeting => {
    //       return meeting.id === el;
    //     });
    //     return meetingInfo[0];
    //   }),
    // );
  }, [getJoinedRoom, isFocused]);

  const isFocused = useIsFocused();

  const getJoinedRoom = useCallback(async () => {
    const userData = await getUser(user?.id);

    const data = await Promise.all(
      userData.joinedroomId.map(async el => {
        const res = await getMeeting(el);
        const host = await getUser(res.data().hostId);
        return {
          id: res.id,
          ...res.data(),
          hostInfo: host,
        };
      }),
    );
    // saveMeeting({...meetingData.rooms, joinedrooms: data});
    setJoinedRoom(data);
  }, [user]);

  return (
    <ScrollView
      horizontal={true}
      style={styles.listView}
      contentContainerStyle={styles.paddingRight}>
      {joinedRoom.length !== 0 ? (
        joinedRoom
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
          .map((el, index) => (
            <ParticipatedMeetings
              item={el}
              key={index}
              getJoinedRoom={getJoinedRoom}
            />
          ))
      ) : (
        // <View style={styles.emptyView}>
        <Text style={styles.emptyText}>참여 중인 미팅이 없습니다.</Text>
        // </View>
      )}
    </ScrollView>
  );
}

function ParticipatedMeetings({item, getJoinedRoom}) {
  const user = useUser();
  const navigation = useNavigation();
  const [cancelModal, setCancelModal] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [earnModalVisible, setEarnModalVisible] = useState(false);
  const {showToast} = useToast();

  const renderButton = () => {
    // if (
    //   item?.status === 'confirmed' &&
    //   item.members.filter(el => {
    //     return Object.keys(el)[0] === user.id;
    //   })[0][user.id] === 'fixed'
    // ) {
    //   return (
    //     <TouchableOpacity
    //       style={{
    //         ...styles.button,
    //         ...styles.backgroundColorBlue,
    //       }}
    //       onPress={() => setStartModalVisible(true)}>
    //       <Text style={styles.buttonText}>참여 보상받기</Text>
    //     </TouchableOpacity>
    //   );
    // if (item?.status === 'end') {
    if (item?.status === 'confirmed') {
      return <Text style={styles.finishText}>종료된 미팅</Text>;
    }
  };
  const handleStart = () => {
    try {
      changeJoinerToConfirmed(item.id, user.id);
      showToast('success', '1TING이 지급되었습니다!');
      getJoinedRoom();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <TouchableOpacity
        style={styles.meetingCard}
        onPress={() => {
          // console.log(item);
          navigation.navigate('ChattingListPage');
          setTimeout(() => {
            navigation.navigate('ChattingRoom', {data: item});
          }, 800);
        }}>
        <View>
          <View style={styles.usernamelikes}>
            <View style={styles.imageNickname}>
              <Image
                source={{uri: item.hostInfo.nftProfile}}
                style={styles.userImage}
              />
              <Text style={styles.username}>{item.hostInfo.nickName}</Text>
            </View>
            <MeetingLikes meetingId={item.id} />
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
          </View>

          <View style={styles.meetingInfo}>
            <Text style={styles.details}>{item.region}</Text>
            <View style={styles.bar} />

            <Text style={styles.details}>
              {handleDateInFormat(item.meetDate)}
            </Text>
            <View style={styles.bar} />
            <Text Text style={styles.details}>
              {item.peopleNum + ':' + item.peopleNum}
            </Text>
          </View>
          {/* <View style={styles.spaceBetween}>{renderButton()}</View> */}

          <View style={styles.tagcontainer}>
            <Text style={styles.tagText}>
              {item.meetingTags?.reduce((acc, cur) => {
                if (acc.length > 24) {
                  return acc;
                }
                return acc + '#' + cur + ' ';
              }, '')}
            </Text>
          </View>
          {/* <View style={styles.container}>
            <Image
              style={styles.hostImage}
              source={{
                uri: item.hostImage,
              }}
            />
            <Text style={styles.hostName}>{item.hostId}</Text>
          </View> */}
          {/* <View
          style={{
            ...styles.container,
            ...styles.spaceBetween,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text>상태: </Text>
            <Text style={{fontWeight: 'bold', marginRight: 10}}>
              {item.status === 'pending' ? '대기 중' : '참여 완료'}
            </Text>

          </View>
          {item.status === 'pending' ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCancelModal(true)}>
              <Text style={styles.buttonText}>참가신청 취소하기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                ...styles.cancelButton,
                ...styles.backgroundColorBlue,
              }}
              onPress={() => {
                navigation.navigate('ChattingRoom', {data: item});
              }}>
              <Text style={styles.buttonText}>채팅방 이동하기</Text>
            </TouchableOpacity>
          )}
        </View> */}
        </View>
        <DoubleModal
          text="미팅 참여 보상을 받으시겠습니까?"
          nButtonText="아니오"
          pButtonText="네"
          modalVisible={startModalVisible}
          setModalVisible={setStartModalVisible}
          pFunction={() => {
            setStartModalVisible(!startModalVisible);
            setEarnModalVisible(true);
          }}
        />
        <EarnModal
          EarnModalVisible={earnModalVisible}
          setEarnModalVisible={setEarnModalVisible}
          amount={1}
          txType="미팅 참여"
          pFunction={handleStart}
        />
        <DoubleModal
          text="미팅 참가신청을 취소하시겠어요?"
          nButtonText="네"
          pButtonText="아니오"
          modalVisible={cancelModal}
          setModalVisible={setCancelModal}
          nFunction={() => {
            setCancelModal(false);
            showToast('success', '취소되었습니다');
          }}
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  tagcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  meetingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingCard: {
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(234, 255, 239, 0.8)',
    marginBottom: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: 174,
    width: width * 0.88,
    borderRadius: 30,
    marginVertical: 8,
    marginRight: 8,
  },
  titleRow: {
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    height: 43,
    width: '100%',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    lineHeight: 22.4,
    color: '#000000',
  },

  details: {
    fontSize: 13,
    color: '#3C3D43',
    letterSpacing: -0.5,
    fontWeight: '500',
    lineHeight: 18.2,
  },

  deleteButton: {
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    backgroundColor: 'black',
    width: 80,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 10,
  },
  tag: {
    marginRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#3C3D43',
    letterSpacing: -0.5,
    lineHeight: 18.2,
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: {
    width: 1,
    height: 9,
    marginHorizontal: 4,
    backgroundColor: '#3C3D43',
  },

  finishText: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  emptyText: {color: 'lightgray', marginTop: 30, marginLeft: 30},
  imageNickname: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernamelikes: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userImage: {
    borderRadius: 100,
    width: 30,
    height: 30,
    marginRight: 8,
  },
  username: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.5,
    textAlign: 'right',
    lineHeight: 21,
    color: '#000000',
  },
  listView: {
    paddingHorizontal: 15,
  },
  paddingRight: {
    paddingRight: 25,
  },
});

export default ParticipatedMeetingList;
