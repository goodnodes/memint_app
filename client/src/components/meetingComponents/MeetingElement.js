import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Image} from 'react-native';
import {handleBirth, handleDateInFormat} from '../../utils/common/Functions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MeetingLikes from './MeetingLikes';

function MeetingElement({item}) {
  const navigation = useNavigation();
  const handleNavigate = () => {
    navigation.navigate('MeetingDetail', {data: item});
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
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
        <View style={styles.titleArea}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.infoList}>
          <Text style={[styles.infoEl]}>{item.region}</Text>
          <View style={styles.bar} />
          <Text style={[styles.infoEl]}>
            {item.peopleNum + ':' + item.peopleNum}
          </Text>
          <View style={styles.bar} />
          <Text style={[styles.infoEl]}>
            {handleBirth(item.hostInfo.birth)}
          </Text>
          <View style={styles.bar} />
          <Text style={[styles.infoEl]}>
            {item.meetDate.toDate().toLocaleString('en').slice(0, -17) +
              item.meetDate.toDate().toLocaleString('en').slice(-11, -6) +
              item.meetDate.toDate().toLocaleString('en').slice(-2)}
          </Text>
        </View>
        <View style={styles.meetingTags}>
          <Text style={styles.tagText}>
            {item.meetingTags?.reduce((acc, cur) => {
              if (acc.length > 24) {
                return acc;
              }
              return acc + '#' + cur + ' ';
            }, '')}
          </Text>
          {/* {item.meetingTags?.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{'#' + tag}</Text>
            </View>
          ))} */}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNavigate}>
        <Text style={styles.buttonText}>{'    '}Join</Text>
        <Icon name="play-arrow" size={24} color={'#58FF7D'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    height: 209,
  },
  container: {
    backgroundColor: 'rgba(234, 255, 239, 0.8)',
    flexDirection: 'column',
    paddingHorizontal: 25,
    paddingVertical: 30,
    height: 196,
    borderRadius: 30,
    justifyContent: 'flex-start',
  },
  usernamelikes: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleArea: {
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    height: 44,
    width: '100%',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    lineHeight: 22.4,
    color: '#000000',
  },
  meetingTags: {
    flexDirection: 'row',
    width: '100%',
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
  infoList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoEl: {
    fontSize: 13,
    color: '#3C3D43',
    letterSpacing: -0.5,
    fontWeight: '500',
    lineHeight: 18.2,
  },
  bar: {
    width: 1,
    height: 9,
    marginHorizontal: 4,
    backgroundColor: '#3C3D43',
  },
  imageNickname: {
    flexDirection: 'row',
    alignItems: 'center',
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
  button: {
    backgroundColor: '#ffffff',
    width: 113,
    height: 49,
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingLeft: 13,
    paddingRight: 10,
    alignItems: 'center',
    position: 'absolute',
    right: 25,
    bottom: 0,
    shadowColor: 'rgba(174, 255, 192, 0.5)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.65,
    shadowRadius: 11.95,

    elevation: 18,
  },
  buttonText: {
    fontSize: 18,
    letterSpacing: -0.5,
    fontWeight: '600',
    color: '#3C3D43',
    lineHeight: 22.4,
  },
});

export default MeetingElement;
