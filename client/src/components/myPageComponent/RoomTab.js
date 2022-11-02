import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useUser from '../../utils/hooks/UseUser';
import BasicButton from '../common/BasicButton';
import MyMeetingList from './MyMeetingList';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ParticipatedMeetingList from './ParticipatedMeetingList';

function RoomTab({tabActive}) {
  const navigation = useNavigation();
  const [meetingRoom, setMeetingRoom] = useState(0);
  const room = [{name: '내가 만든 방'}, {name: '참여 중인 방'}];
  const userInfo = useUser();
  const selecteMenuHandler = index => {
    setMeetingRoom(index);
  };
  const handleLikesNavigate = () => {
    navigation.navigate('MyLikesRooms');
  };
  return (
    <>
      {/* 찜한 미팅방 */}
      <View style={styles.mylikes}>
        <TouchableOpacity
          style={styles.mylikesButton}
          onPress={handleLikesNavigate}>
          <Text style={styles.mylikesText}>내가 찜한 미팅</Text>
          <Icon name="chevron-right" size={22} color={'#AEFFC1'} />
        </TouchableOpacity>
      </View>
      {tabActive && (
        <>
          {/* 탭 선택 버튼 */}
          <View style={styles.meetingButton}>
            {room.map((ele, index, key) => {
              return (
                <BasicButton
                  text={ele.name}
                  width={160}
                  height={40}
                  textSize={16}
                  backgroundColor={
                    meetingRoom === index ? '#AEFFC0' : 'transparent'
                  }
                  textColor={meetingRoom === index ? 'black' : 'white'}
                  borderRadius={30}
                  border={meetingRoom === index ? true : false}
                  margin={[10, 3, 3, 3]}
                  onPress={() => selecteMenuHandler(index)}
                  key={index}
                />
              );
            })}
          </View>
          {/*탭 선택에 따른 미팅 리스트 */}
          {meetingRoom === 0 ? (
            <MyMeetingList user={userInfo} />
          ) : (
            <ParticipatedMeetingList user={userInfo} />
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mylikesButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mylikesText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: '#ffffff',
    lineHeight: 22.4,
  },
  mylikes: {
    marginTop: 23,
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  meetingButton: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default RoomTab;
