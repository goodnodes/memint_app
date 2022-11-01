import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import useUser from '../../utils/hooks/UseUser';
import Icon from 'react-native-vector-icons/MaterialIcons';

function ChattingRoomTopTab({data}) {
  const meetingRef = useMemo(() => {
    return firestore().collection('Meeting').doc(data.id);
  }, [data]);
  const user = useUser();
  const [roomData, setRoomData] = useState('');
  const navigation = useNavigation();
  const [roomStatus, setRoomStatus] = useState('');

  useEffect(() => {
    return meetingRef.onSnapshot(result => {
      if (result.data() === undefined) {
        navigation.navigate('MeetingMarket');
      } else {
        setRoomData(result.data());
        setRoomStatus(result.data().status);
      }
    });
  }, [meetingRef]);

  useEffect(() => {
    if (roomStatus === 'open') setRoomStatus('모집중');
    else if (roomStatus === 'full') setRoomStatus('모집완료');
    else if (roomStatus === 'fixed') setRoomStatus('확정');
    else if (roomStatus === 'confirmed') setRoomStatus('현장확인');
    // else if (roomStatus === 'end') setRoomStatus('미팅종료');
  }, [roomStatus]);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>
          {roomData &&
            roomData.title.slice(0, 20) +
              `${roomData.title.length > 20 ? '...' : ''}`}
        </Text>
        <View style={styles.status}>
          <Text style={styles.statusText}>{roomStatus && roomStatus}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('meeting');
          setTimeout(() => {
            navigation.navigate('MeetingDetail', {data: data});
          }, 300);
        }}
        style={styles.row}>
        <Text style={styles.meetingDetailText}>미팅 정보 보러가기</Text>
        <Icon name="arrow-right" size={20} color={'#ffffff'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  status: {
    paddingVertical: 0.5,
    paddingHorizontal: 9.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#58FF7D',
  },
  statusText: {
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: -0.5,
    lineHeight: 19.6,
  },
  button: {
    width: 90,
    height: 40,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  meetingDetailText: {
    // marginTop: 13,
    color: '#ffffff',
    fontSize: 15,
    letterSpacing: -0.5,
    lineHeight: 21,
  },
  title: {
    // paddingRight: 7,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.5,
    lineHeight: 22.4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // maxWidth: 270,
  },
});

export default ChattingRoomTopTab;
