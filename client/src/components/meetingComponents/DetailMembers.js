import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {handleBirth} from '../../utils/common/Functions';
import useUser from '../../utils/hooks/UseUser';
import UserInfoModal from '../common/UserInfoModal';

function DetailMembers({membersInfo, peopleNum, hostId}) {
  const userInfo = useUser();
  const visibleList = userInfo.visibleUser;
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);
  const [userId, setUserId] = useState('');

  const currentPeopleNum = () => {
    //2 ->2:2 현재 1:0
    if (membersInfo.length > peopleNum) {
      return peopleNum + ':' + (membersInfo.length - peopleNum);
    } else {
      return membersInfo.length + ':' + 0;
    }
  };
  const checkIsVisible = userId => {
    // console.log(visibleList)
    if (!visibleList) return false;
    if (visibleList.indexOf(userId) !== -1) {
      return true;
    }
    return false;
  };

  return (
    <View style={styles.memberBox}>
      <View style={styles.memberBoxInfo}>
        <Text style={styles.title}>현재 미팅 참여자</Text>
        <View style={styles.memberBoxInfopeopleNum}>
          <Text style={styles.currentPeopleNum}>
            {membersInfo.length}
            <Text style={styles.peopleNum}>/{peopleNum * 2}</Text>
          </Text>
          <Text style={styles.peopleNum}>{`(${peopleNum}:${peopleNum})`}</Text>
        </View>
      </View>
      <View style={styles.memberList}>
        {membersInfo.map((member, idx) => (
          <View key={idx} style={styles.memberInfo}>
            <View style={styles.memberInfoProfile}>
              <TouchableOpacity
                onPress={() => {
                  setUserId(member.id);
                  setUserInfoModalVisible(true);
                }}>
                <Image
                  source={{uri: member.nftProfile}}
                  style={[
                    styles.userImage,
                    member.id === hostId ? styles.hostImage : null,
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.memberInfoCol}>
              <Text style={styles.memberInfoNickName}>
                {member.nickName} {member.property.emoji}
              </Text>
              <View style={styles.memberGenderAge}>
                <Text style={styles.memberInfoContentEl}>
                  {handleBirth(member.birth)}
                </Text>
                <Text
                  style={styles.memberInfoContentEl}>{` (${member.gender?.slice(
                  0,
                  1,
                )})`}</Text>
              </View>
            </View>
          </View>
        ))}
        {membersInfo.peopleNum * 2 > membersInfo.length ? '' : ''}
      </View>
      <UserInfoModal
        userId={userId}
        userInfoModalVisible={userInfoModalVisible}
        setUserInfoModalVisible={setUserInfoModalVisible}
        pFunction={() => {}}
        visible={checkIsVisible(userId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  memberBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  memberBoxInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  memberList: {
    flexDirection: 'column',
  },
  memberBoxInfopeopleNum: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  memberGenderAge: {
    flexDirection: 'row',
  },
  memberInfoCol: {
    justifyContent: 'space-between',
    height: 53,
  },
  memberInfoContentEl: {
    color: '#B9C5D1',
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: -0.5,
  },
  memberInfoNickName: {
    fontWeight: '400',
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 25.2,
    letterSpacing: -0.5,
  },
  title: {
    fontWeight: '400',
    color: '#B9C5D1',
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: -0.5,
  },
  currentPeopleNum: {
    fontWeight: '600',
    color: '#AEFFC1',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  peopleNum: {
    fontWeight: '400',
    color: '#B9C5D1',
    fontSize: 18,
    lineHeight: 25.2,
    letterSpacing: -0.5,
  },
  image: {
    width: 40,
    height: 40,
  },
  userImage: {
    borderRadius: 100,
    width: 53,
    height: 53,
    marginRight: 8,
  },
  hostImage: {
    borderWidth: 2,
    borderColor: '#58FF7D',
  },
});

export default DetailMembers;
