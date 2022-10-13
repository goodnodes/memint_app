import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import {handleDate, handleDateInFormat} from '../../utils/common/Functions';
import {getUser} from '../../lib/Users';
import {getMeeting} from '../../lib/Meeting';
import {useIsFocused} from '@react-navigation/native';
import MeetingLikes from '../meetingComponents/MeetingLikes';
import {ScrollView} from 'react-native-gesture-handler';

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
const {width} = Dimensions.get('window');

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
    <ScrollView
      horizontal={true}
      style={styles.listView}
      contentContainerStyle={styles.paddingRight}>
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
        // <View style={styles.emptyView}>
        <Text style={styles.emptyText}>There are no rooms I hosted.</Text>
        // {/* </View> */}
      )}
    </ScrollView>
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
            <Text style={styles.title}>{item?.title}</Text>
          </View>

          <View style={styles.meetingInfo}>
            <Text style={styles.details}>{item?.region}</Text>
            <View style={styles.bar} />

            <Text style={styles.details}>
              {item ? handleDate(item.meetDate) : ''}
            </Text>
            <View style={styles.bar} />

            <Text style={styles.details}>
              {item?.peopleNum + ':' + item?.peopleNum}
            </Text>
          </View>

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

export default MyMeetingList;
