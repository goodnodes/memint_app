import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
  Button,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MeetingElement from '../../components/meetingComponents/MeetingElement';
import WalletButton from '../../components/common/WalletButton';
import SingleModal from '../../components/common/SingleModal';
import {getMeetings} from '../../lib/Meeting';
import {useIsFocused} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import FilterModal from '../../components/meetingComponents/FilterModal';
import {getUser} from '../../lib/Users';
import {signOut} from '../../lib/Auth';
import useAuthActions from '../../utils/hooks/UseAuthActions';
import LinearGradient from 'react-native-linear-gradient';
import SafeStatusBar from '../../components/common/SafeStatusBar';
import Sauropod from '../../assets/icons/Sauropod.png';
import DoubleModal from '../../components/common/DoubleModal';
import useUser from '../../utils/hooks/UseUser';
import ActivationModal from '../../components/common/ActivationModal';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

function MeetingMarket({navigation}) {
  const userState = useUser();
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [shownMeetings, setShownMeetings] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [activationModalVisible, setActivationModalVisible] = useState(false);
  const [sortSelect, setSortSelect] = useState(undefined);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [creationMessage, setCreationMessage] = useState(false);
  const [filter, setFilter] = useState({
    region: '서울 전체',
    peopleNum: undefined,
    meetDate: new Date(),
    meetingTags: undefined,
  });

  const isFocused = useIsFocused();

  useEffect(() => {
    setSortSelect(0);
    setFilter({
      region: '서울 전체',
      peopleNum: undefined,
      meetDate: new Date(),
      meetingTags: undefined,
    });
    getMeetingMarket();
  }, [isFocused, getMeetingMarket]);

  useEffect(() => {
    setFilteredMeetings(handleFilter(meetings));
    handleSort();
  }, [handleFilter, meetings, filter, handleSort, sortSelect]);

  const handleCreateMeeting = async () => {
    if (userState.isActivated) {
      setConfirmModalVisible(true);
    } else {
      setActivationModalVisible(true);
    }
  };
  const getMeetingMarket = useCallback(async () => {
    try {
      const res = await getMeetings();
      const data = res.docs.map(el => {
        return {
          ...el.data(),
          id: el.id,
          // meetDate: handleDate(el.data().meetDate),
        };
      });

      const dataWithHostInfo = await Promise.all(
        data
          .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
          .map(async el => {
            const hostInfo = await getUser(el.hostId);
            return {
              ...el,
              hostInfo: {...hostInfo},
            };
          }),
      );
      setMeetings(dataWithHostInfo);
      setFilteredMeetings(handleFilter(dataWithHostInfo));
      setShownMeetings(handleFilter(dataWithHostInfo));
      // setRegionMeetings(dataWithHostInfo);
      // setFilteredMeetings(dataWithHostInfo);
    } catch (e) {}
  }, [handleFilter]);

  const handleSort = useCallback(() => {
    if (sortSelect === undefined || sortSelect === 0) {
      setShownMeetings(filteredMeetings);
    } else if (sortSelect === 1) {
      setShownMeetings(
        filteredMeetings.sort((a, b) => {
          const x = a.meetDate.toDate() - new Date();
          const y = b.meetDate.toDate() - new Date();
          if (x < y) {
            return -1;
          } else {
            return 1;
          }
        }),
      );
    } else if (sortSelect === 2) {
      setShownMeetings(
        filteredMeetings.sort((a, b) => {
          const x = a.hostInfo.birth.slice(0, 4);
          const y = b.hostInfo.birth.slice(0, 4);
          if (x > y) {
            return -1;
          } else {
            return 1;
          }
        }),
      );
    }
  }, [sortSelect, filteredMeetings, filter]);

  const handleFilter = useCallback(
    value => {
      let res = handleRegion(value);
      res = handlePeopleNum(res);
      res = handleMeetDate(res);
      res = handleMeetingTags(res);
      return res;
    },
    [handleRegion, handlePeopleNum, handleMeetDate, handleMeetingTags, filter],
  );

  const handleRegion = useCallback(
    value => {
      const region = filter.region;
      if (region === undefined || region === '서울 전체') {
        return value;
      } else {
        return value.filter(meeting => meeting.region === region);
      }
    },
    [filter.region],
  );

  const handlePeopleNum = useCallback(
    value => {
      const peopleNum = filter.peopleNum;
      if (peopleNum === undefined || peopleNum === 0) {
        return value;
      } else {
        return value.filter(meeting => meeting.peopleNum === peopleNum);
      }
    },
    [filter.peopleNum],
  );

  const handleMeetDate = useCallback(
    value => {
      const meetDate = filter.meetDate;
      return value.filter(meeting => meeting.meetDate.toDate() >= meetDate);
    },
    [filter.meetDate],
  );

  const handleMeetingTags = useCallback(
    value => {
      const meetingTags = filter.meetingTags;
      if (meetingTags === undefined || meetingTags === 0) {
        return value;
      } else {
        return value.filter(
          meeting => meeting.meetingTags.indexOf(meetingTags) !== -1,
        );
      }
    },
    [filter.meetingTags],
  );

  const handleMessage = async () => {
    const delay = ms => {
      return new Promise(resolve =>
        setTimeout(() => {
          resolve(ms);
        }, ms),
      );
    };
    fadeIn();
    setCreationMessage(true);
    const result = delay(2000);
    result.then(() => {
      fadeOut();
    });
  };
  const opacity = useRef(new Animated.Value(0)).current;
  const fadeDuration = 1000;

  const fadeIn = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: fadeDuration,
      useNativeDriver: true,
    }).start();
  }, [opacity]);
  const fadeOut = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: fadeDuration,
      useNativeDriver: true,
    }).start(() => {
      setCreationMessage(false);
    });
  }, [opacity]);

  const RegionDropDownData = [
    {label: 'SEOUL', value: '서울 전체'},
    {label: '강남', value: '강남'},
    {label: '신사', value: '신사'},
    {label: '홍대', value: '홍대'},
    {label: '신촌', value: '신촌'},
    {label: '여의도', value: '여의도'},
    {label: '구로', value: '구로'},
    {label: '신도림', value: '신도림'},
    {label: '혜화', value: '혜화'},
    {label: '안암', value: '안암'},
    {label: '종로', value: '종로'},
    {label: '동대문', value: '동대문'},
    {label: '성수', value: '성수'},
    {label: '이태원', value: '이태원'},
  ];
  const SortDropDownData = [
    {label: '정렬', value: 0},
    {label: '시간 가까운 순', value: 1},
    {label: '나이 젊은 순', value: 2},
    {label: '위치 가까운 순', value: 3},
  ];
  const FilterPeopleDropDownData = [
    {label: '2:2', value: 2},
    {label: '3:3', value: 3},
    {label: '4:4', value: 4},
  ];
  const {logout} = useAuthActions();
  const handleSignOut = useCallback(async () => {
    try {
      logout();
      await signOut();
    } catch (e) {
      console.log(e);
    } finally {
      navigation.navigate('SignIn');
    }
  }, [navigation, logout]);

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <SafeStatusBar />
      ) : (
        <FocusAwareStatusBar
          backgroundColor="#3D3E44"
          barStyle="light-content"
          animated={true}
        />
      )}

      <LinearGradient
        colors={['#3D3E44', '#5A7064']}
        start={{x: 1, y: 0.3}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}>
        {/* <Button title="로그아웃 하기" color="red" onPress={handleSignOut} /> */}
        <Image source={Sauropod} style={styles.backgroundImage} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.paddingBottom}>
          <View style={styles.areaEnd}>
            <WalletButton />
          </View>
          <View style={styles.titleArea}>
            <Text style={styles.title}>새로운 친구들과 술 한잔 어때?</Text>
            <View style={styles.regionView}>
              <RNPickerSelect
                placeholder={{}}
                onValueChange={value => {
                  setFilter({...filter, region: value});
                }}
                items={RegionDropDownData}
                value={filter.region}
                fixAndroidTouchableBug={true}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    color: 'white',
                    fontFamily: 'NeoDunggeunmoPro-Regular',
                    letterSpacing: 2.5,
                  },
                  inputAndroid: {
                    color: 'white',
                    fontFamily: 'NeoDunggeunmoPro-Regular',
                    letterSpacing: 2.5,
                  },
                }}
              />
            </View>
          </View>

          <View style={styles.listfilterArea}>
            <Pressable
              style={styles.listfilter}
              onPress={() => {
                setFilterModalVisible(true);
              }}>
              <Icon name="filter-alt" size={20} color={'#ffffff'} />
              <Text style={styles.smallText}> 조건 설정</Text>
              <FilterModal
                setFilter={setFilter}
                FilterPeopleDropDownData={FilterPeopleDropDownData}
                filter={filter}
                filterModalVisible={filterModalVisible}
                setFilterModalVisible={setFilterModalVisible}
                // handleFilter={()=>{}}
              />
            </Pressable>
            <View style={styles.listfilter}>
              <Icon
                name="swap-vert"
                size={20}
                color={'#ffffff'}
                style={[
                  styles.icon,
                  Platform.OS === 'android' ? styles.iconAndroid : null,
                ]}
              />
              <RNPickerSelect
                placeholder={{}}
                onValueChange={value => {
                  setSortSelect(value);
                }}
                items={SortDropDownData}
                value={sortSelect}
                style={{
                  inputIOS: {
                    color: 'white',
                  },
                  inputAndroid: {color: 'white'},
                }}
                fixAndroidTouchableBug={true}
                useNativeAndroidPickerStyle={false}
                // Icon={() => {
                //   return (
                //     <Icon
                //       name="swap-vert"
                //       size={20}
                //       color={'#ffffff'}
                //       style={[
                //         styles.icon,
                //         Platform.OS === 'android' ? styles.iconAndroid : null,
                //       ]}
                //     />
                //   );
                // }}
              />
            </View>
          </View>
          {shownMeetings.length === 0 ? (
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>해당하는 미팅이 없습니다</Text>
            </View>
          ) : (
            <View style={styles.meetingLists}>
              {shownMeetings.map((meeting, idx) => {
                return <MeetingElement key={idx} item={meeting} />;
              })}
            </View>
          )}

          <DoubleModal
            text="미팅을 생성하시겠습니까?"
            //body={<Text>정말로?</Text>}
            buttonText="네"
            modalVisible={confirmModalVisible}
            setModalVisible={setConfirmModalVisible}
            pFunction={() => {
              setConfirmModalVisible(!confirmModalVisible);
              navigation.navigate('MeetingCreate');
            }}
            nFunction={() => {
              setConfirmModalVisible(!confirmModalVisible);
            }}
          />
          <ActivationModal
            text="Activation Code가 필요합니다."
            //body={<Text>정말로?</Text>}
            buttonText="인증하기"
            modalVisible={activationModalVisible}
            setModalVisible={setActivationModalVisible}
            setNextModalVisible={setConfirmModalVisible}
          />
        </ScrollView>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateMeeting}
          onLongPress={handleMessage}>
          <Icon name="add" size={30} color={'#58FF7D'} />
        </TouchableOpacity>
        {creationMessage ? (
          <Animated.View style={styles.creationMessage}>
            <Text style={styles.creationMessageText}>
              버튼을 클릭하고 새로운 미팅을 생성하세요!
            </Text>
          </Animated.View>
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: '100%',
    // backgroundColor: 'white',
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 15,
  },
  areaEnd: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // paddingRight: 10,
  },
  createButton: {
    position: 'absolute',
    bottom: 110,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#1D1E1E',
    borderRadius: 999,
    borderWidth: 1.3,
    borderColor: '#AEFFC1',
  },
  createButtonText: {
    fontSize: 14,
    letterSpacing: -0.5,
    color: '#58FF7D',
    marginRight: 7,
  },
  titleArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#ffffff',
    width: 191,
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
    lineHeight: 33.6,
  },
  listfilterArea: {
    marginTop: 20,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listfilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  meetingLists: {
    marginTop: 15,
    marginBottom: 40,
    paddingBottom: 65,
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 30,
  },
  emptyText: {
    color: 'lightgray',
  },
  smallText: {
    color: 'white',
    letterSpacing: -0.5,
  },
  backgroundImage: {
    position: 'absolute',
    top: '55%',
    left: '22.5%',
    width: 220,
    height: 220,
  },
  // icon: {
  // width: 45,
  // },
  // iconAndroid: {
  //   top: 15,
  //   left:-2
  // },
  paddingBottom: {
    paddingBottom: 50,
  },
  creationMessage: {
    position: 'absolute',
    bottom: 120,
    left: 15,
    backgroundColor: '#1D1E1E',
    width: '73%',
    height: 40,
    paddingLeft: 10,
    paddingVertical: 11,
    borderRadius: 12,
    borderColor: '#AEFFC1',
    borderWidth: 1,
  },
  creationMessageText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 16,
  },
});

export default MeetingMarket;
