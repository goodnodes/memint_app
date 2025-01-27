import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackButton from '../../components/common/BackButton';
import DoubleModal from '../../components/common/DoubleModal';
import firestore from '@react-native-firebase/firestore';
import {
  deleteMeeting,
  updateMeeting,
  updateMembersOut,
} from '../../lib/Meeting';
import {updateUserMeetingOut} from '../../lib/Users';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseUser';
import {useMeeting} from '../../utils/hooks/UseMeeting';
import useMeetingActions from '../../utils/hooks/UseMeetingActions';
import useAuthActions from '../../utils/hooks/UseAuthActions';

function MeetingSet({route}) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    // console.log({meetingInfo: route.params.meetingInfo.id});
    // console.log({userInfo: route.params.userInfo});
  }, []);
  const meetingInfo = route.params.meetingInfo;
  const userInfo = useUser();
  const navigation = useNavigation();
  const {showToast} = useToast();
  const {rooms} = useMeeting();
  const {saveMeeting} = useMeetingActions();
  const {saveInfo} = useAuthActions();
  useEffect(() => {
    firestore()
      .collection('User')
      .doc(userInfo.id)
      .collection('Feedback')
      .get()
      .then(result =>
        result.docs.forEach(el => {
          console.log(el.id);
        }),
      );
    return () => isFocused;
  }, [userInfo.id, isFocused]);

  const handleNavigateToEdit = () => {
    setEditModal(!editModal);
    navigation.navigate('EditMeetingInfo', {
      item: {
        ...route.params.meetingInfo,
        meetDate: route.params.meetingInfo.meetDate.toDate().toISOString(),
      },
    });
  };
  const handleNavigateToMemberOut = () => {
    navigation.navigate('MeetingMemberOut', {
      data: route.params.userInfo,
      meetingData: route.params.meetingInfo,
    });
  };
  const handleNavigateToReport = () => {
    navigation.navigate('Report');
  };

  const handleDelete = async () => {
    //미팅이 full, open 일때만 삭제 가능
    if (meetingInfo.status !== 'full' && meetingInfo.status !== 'open') {
      showToast('error', '미팅 확정 이후에는 삭제할 수 없습니다');
      return;
    }

    updateUserMeetingOut(userInfo.id, 'createdroomId', meetingInfo.id)
      .then(() => {
        route.params.userInfo.map(el => {
          if (el[2] !== meetingInfo.hostId) {
            updateUserMeetingOut(el[2], 'joinedroomId', meetingInfo.id);
          }
        });
      })
      .then(() => {
        deleteMeeting(meetingInfo.id);
      })
      .then(() => {
        // saveMeeting({
        //   ...rooms,
        //   createdrooms: rooms.createdrooms.filter(
        //     el => el.id !== meetingInfo.id,
        //   ),
        // });
        // saveInfo({
        //   ...userInfo,
        //   createdroomId: userInfo.createdroomId.filter(
        //     el => el !== meetingInfo.id,
        //   ),
        // });
        showToast('success', '미팅이 삭제되었습니다.');
        setDeleteModalVisible(!deleteModalVisible);
        navigation.navigate('ChattingListPage');
        // navigation.reset({routes: [{name: 'MeetingMarket'}]});
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleMeetingOut = async () => {
    //미팅이 확정상태라면 나가지 못함
    console.log();
    if (
      Object.values(
        meetingInfo.members.filter(el => {
          return Object.keys(el)[0] === userInfo.id;
        })[0],
      )[0] !== 'accepted'
    ) {
      showToast('error', '미팅 확정 이후에는 나갈 수 없습니다');
      return;
    }

    updateMembersOut(meetingInfo.id, userInfo.id)
      .then(() => {
        updateUserMeetingOut(
          userInfo.id,
          'joinedroomId',
          meetingInfo.id,
          userInfo.nickName,
          'out',
        );
      })
      .then(() => {
        if (meetingInfo.status === 'full') {
          updateMeeting(meetingInfo.id, {status: 'open'});
        }
      })
      .then(() => {
        showToast('success', '미팅에서 나왔습니다');
        navigation.navigate('ChattingListPage');
      })
      .catch(e => {
        console.log(e);
      });
  };

  // 미팅의 상태가
  const setMeetingEnd = async () => {
    if (route.params.meetingStatus === 'confirmed') {
      return await firestore()
        .collection('Meeting')
        .doc(meetingInfo.id)
        .update({status: 'end'})
        .then(() => {
          showToast('success', '미팅이 종료되었습니다.');
          navigation.pop();
        });
    } else if (meetingInfo.status === 'end') {
      return showToast('error', '이미 종료된 미팅입니다.');
    } else {
      return showToast('error', '미팅 인증을 받은 후 종료 가능합니다.');
    }
  };

  const renderByUser = () => {
    if (route.params.meetingInfo.hostId === userInfo.id) {
      return (
        <>
          <TouchableOpacity
            style={styles.li}
            onPress={() => {
              setEditModal(true);
            }}>
            <Text style={styles.liText}>미팅 정보 변경하기</Text>
            <Icon name="arrow-forward-ios" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.li} onPress={handleNavigateToReport}>
            <Text style={styles.liText}>신고하기</Text>
            <Icon name="arrow-forward-ios" size={20} />
          </TouchableOpacity>

          {route.params.meetingInfo.status === 'open' ||
          route.params.meetingInfo.status === 'full' ? (
            <TouchableOpacity
              style={styles.li}
              onPress={handleNavigateToMemberOut}>
              <Text style={styles.liText}>미팅 멤버 내보내기</Text>
              <Icon name="arrow-forward-ios" size={20} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.li} onPress={setMeetingEnd}>
            <Text style={[styles.liText]}>미팅 끝내기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.li}
            onPress={() => {
              setDeleteModalVisible(true);
            }}>
            <Text style={[styles.liText, styles.deleteText]}>
              미팅 삭제하기
            </Text>
          </TouchableOpacity>
          <DoubleModal
            text="미팅룸 삭제 후 복구가 불가합니다. 삭제하시겠습니까?"
            nButtonText="네"
            pButtonText="아니오"
            modalVisible={deleteModalVisible}
            setModalVisible={setDeleteModalVisible}
            pFunction={() => {
              setDeleteModalVisible(false);
            }}
            nFunction={handleDelete}
          />
          <DoubleModal
            text="미팅 정보를 수정하시겠어요?"
            nButtonText="아니오"
            pButtonText="네"
            modalVisible={editModal}
            setModalVisible={setEditModal}
            pFunction={handleNavigateToEdit}
            nFunction={() => {
              setEditModal(false);
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <TouchableOpacity style={styles.li} onPress={handleNavigateToReport}>
            <Text style={styles.liText}>신고하기</Text>
            <Icon name="arrow-forward-ios" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.li} onPress={handleMeetingOut}>
            <Text style={[styles.liText, styles.deleteText]}>미팅 나가기</Text>
          </TouchableOpacity>
        </>
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>채팅방 설정</Text>
      </View>
      <View style={styles.ul}>{renderByUser()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  ul: {
    marginTop: 10,
  },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginVertical: 15,
  },
  liText: {
    fontSize: 16,
  },
  deleteText: {
    color: '#f87171',
  },
});

export default MeetingSet;
