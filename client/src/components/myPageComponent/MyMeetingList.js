import React, {useCallback, useEffect, useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import {handleDateInFormat} from '../../utils/common/Functions';
import {getUser} from '../../lib/Users';
import {getMeeting} from '../../lib/Meeting';
import {useIsFocused} from '@react-navigation/native';
import MeetingLikes from '../meetingComponents/MeetingLikes';

// function MyMeetingList({List, navigation}) {
//   return (
//     <>
//       <FlatList
//         data={List}
//         renderItem={({item}) => (
//           <MyMeetings item={item} navigation={navigation} />
//         )}
//       />
//     </>
//   );
// }

function MyMeetingList({navigation, user}) {
  const [createdrooms, setCreatedRoom] = useState([]);
  const isFocused = useIsFocused();
  let {rooms} = useMeeting(); //redux crete, join에 있는 모든 미팅 정보들
  // const {createdrooms} = rooms;
  const getCreatedRoom = useCallback(async () => {
    const userData = await getUser(user?.id);

    const data = await Promise.all(
      userData.createdroomId.map(async el => {
        const res = await getMeeting(el);
        const host = await getUser(res.data().hostId);
        return {
          id: res.id,
          ...res.data(),
          hostInfo: host,
        };
      }),
    );
    setCreatedRoom(data);
  }, [user]);

  useEffect(() => {
    getCreatedRoom();
  }, [isFocused, getCreatedRoom]);

  return (
    <>
      {createdrooms.length !== 0 ? (
        createdrooms.map((el, index) => (
          <MyMeetings
            item={el}
            navigation={navigation}
            key={index}
            // getCreatedRoom={getCreatedRoom}
          />
        ))
      ) : (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>생성한 미팅이 없습니다.</Text>
        </View>
      )}
    </>
  );
}

function MyMeetings({item, navigation}) {
  // const meetings = useMeeting();
  // const {saveMeeting} = useMeetingActions();
  const renderButton = () => {
    if (item?.status === 'end') {
      return <Text style={styles.finishText}>종료된 미팅</Text>;
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.meetingCard}
        onPress={() => {
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
            <Text style={styles.title}>{item?.title}</Text>
          </View>

          <View style={styles.meetingInfo}>
            <Text style={styles.details}>{item?.region}</Text>
            <View style={styles.bar} />

            <Text style={styles.details}>
              {item ? handleDateInFormat(item.meetDate) : ''}
            </Text>
            <View style={styles.bar} />

            <Text style={styles.details}>
              {item?.peopleNum + ':' + item?.peopleNum}
            </Text>
          </View>

          <View style={styles.tagcontainer}>
            {item?.meetingTags.map((type, index) => {
              return (
                <View style={styles.tag} key={index}>
                  <Text style={styles.tagFont}># {type}</Text>
                </View>
              );
            })}
          </View>

          {/* <View style={styles.spaceBetween}>{renderButton()}</View> */}
        </View>

        {/* <DoubleModal
          text="미팅을 종료하시겠습니까?"
          nButtonText="아니오"
          pButtonText="네"
          modalVisible={endModal}
          setModalVisible={setEndModal}
          pFunction={() => {
            setEndModal(false);
            //earnModal 띄우기
            handleMeetingEnd();
          }}
          nFunction={() => {
            setEndModal(false);
          }}
        /> */}
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

export default MyMeetingList;
