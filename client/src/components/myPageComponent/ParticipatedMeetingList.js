import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';

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
    <>
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
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>참여 중인 미팅이 없습니다.</Text>
        </View>
      )}
    </>
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
    if (item?.status === 'end') {
      return <Text style={styles.finishText}>종료된 미팅</Text>;
    }
  };
  const handleStart = () => {
    try {
      changeJoinerToConfirmed(item.id, user.id);
      showToast('success', '1LCN이 지급되었습니다!');
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
          navigation.navigate('ChattingRoom', {data: item});
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
            {item.meetingTags.map((tag, index) => {
              return (
                <View style={styles.tag} key={index}>
                  <Text style={styles.tagFont}># {tag}</Text>
                </View>
              );
            })}
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
  },
  meetingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  // meetingCard: {
  //   backgroundColor: 'white',
  //   marginVertical: '2%',
  //   paddingVertical: '3%',
  //   paddingHorizontal: '10%',
  // },
  meetingCard: {
    justifyContent: 'space-between',
    backgroundColor: 'rgba(234, 255, 239, 0.8)',
    marginBottom: 5,
    paddingHorizontal: 30,
    paddingVertical: 25,
    height: 185,
    borderRadius: 30,
    marginVertical: 8,
    marginHorizontal: 15,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,

    // elevation: 5,
  },
  titleRow: {
    marginBottom: 4,
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    height: 43,
    width: '100%',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },

  details: {
    fontSize: 13,
    color: '#3C3D43',
    letterSpacing: -0.5,
    fontWeight: '500',
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
  tagFont: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3C3D43',
    letterSpacing: -0.5,
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
  emptyText: {color: 'lightgray'},
  imageNickname: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernamelikes: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImage: {
    borderRadius: 100,
    width: 30,
    height: 30,
    marginRight: 5,
  },
  username: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.5,
    textAlign: 'right',
  },
});

export default ParticipatedMeetingList;
