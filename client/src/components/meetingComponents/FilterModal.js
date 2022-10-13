import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Button,
} from 'react-native';
import DatePicker from '../common/DatePicker';
import RNPickerSelect from 'react-native-picker-select';
import SingleModal from '../common/SingleModal';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {meetingTags} from '../../assets/docs/contents';
import {signOut} from '../../lib/Auth';
import {useNavigation} from '@react-navigation/native';
import useAuthActions from '../../utils/hooks/UseAuthActions';

function FilterModal({
  setFilter,
  FilterPeopleDropDownData,
  filter,
  filterModalVisible,
  setFilterModalVisible,
}) {
  const navigation = useNavigation();
  const [datePicker, setDatePicker] = useState(false);

  const tags = [
    ...meetingTags.alcohol.map(el => {
      return {label: el, value: el};
    }),
    ...meetingTags.mood.map(el => {
      return {label: el, value: el};
    }),
    ...meetingTags.topic.map(el => {
      return {label: el, value: el};
    }),
  ];
  // const getTags = useCallback(async () => {
  //   const res = await getMeetingTags();
  //   const data = res.docs.map(el => el.data());
  //   const meetingTags = data
  //     .sort((a, b) => {
  //       if (a.type > b.type) {
  //         return -1;
  //       } else {
  //         return 1;
  //       }
  //     })
  //     .map(el => {
  //       return {label: el.content, value: el.content};
  //     });
  //   setTags(meetingTags);
  // }, []);

  const showDatePicker = () => {
    setDatePicker(true);
  };

  const onDateSelected = (event, value) => {
    setFilter({...filter, meetDate: value});
    setDatePicker(false);
  };
  const {logout} = useAuthActions();

  const handleSignOut = useCallback(async () => {
    try {
      setFilterModalVisible(false);
      logout();
      await signOut();
    } catch (e) {
      console.log(e);
    } finally {
      navigation.navigate('SignIn');
    }
  }, [navigation, logout, setFilterModalVisible]);

  return (
    <SingleModal
      text="Filter"
      body={
        <View style={styles.filterContent}>
          {/* <Button title="" color="red" onPress={handleSignOut} /> */}

          <View style={styles.filterElement}>
            <Text style={styles.filterText}>member</Text>
            <View>
              <RNPickerSelect
                placeholder={{label: 'number of members', value: 0}}
                onValueChange={value => {
                  setFilter({...filter, peopleNum: value});
                }}
                items={FilterPeopleDropDownData}
                value={filter.peopleNum}
                fixAndroidTouchableBug={true}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    color: 'black',
                  },
                  inputAndroid: {
                    fontSize: 16,
                    color: 'black',
                  },
                  placeholder: {
                    fontSize: 16,
                    color: 'gray',
                  },
                }}
              />
            </View>
          </View>
          <View style={styles.filterElement}>
            <Text style={styles.filterText}>date</Text>
            {Platform.OS === 'ios' ? (
              <DatePicker
                value={filter.meetDate}
                onChange={(event, date) => {
                  setFilter({...filter, meetDate: date});
                }}
              />
            ) : (
              <View>
                {datePicker && (
                  <RNDateTimePicker
                    locale="ko"
                    value={filter.meetDate}
                    mode="date"
                    // textColor="#EAFFEF"
                    accentColor="#AEFFC1"
                    themeVariant="dark"
                    style={styles.datepicker}
                    onChange={onDateSelected}
                  />
                )}
                {!datePicker && (
                  <Pressable onPress={showDatePicker}>
                    <Text style={styles.dateText}>
                      {/* {`${
                        meetingInfo.meetDate.getMonth() + 1
                      }월 ${meetingInfo.meetDate.getDate()}일`} */}
                      {filter.meetDate.toLocaleDateString()}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
          <View style={styles.filterElement}>
            <Text style={styles.filterText}>tag</Text>
            <View>
              <RNPickerSelect
                placeholder={{label: 'set tag', value: 0}}
                onValueChange={value => {
                  setFilter({...filter, meetingTags: value});
                }}
                items={tags}
                value={filter.meetingTags}
                fixAndroidTouchableBug={true}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    color: 'black',
                  },
                  inputAndroid: {
                    fontSize: 16,
                    color: 'black',
                  },
                  placeholder: {
                    fontSize: 16,
                    color: 'gray',
                  },
                }}
              />
            </View>
          </View>
        </View>
      }
      buttonText="Close"
      modalVisible={filterModalVisible}
      setModalVisible={setFilterModalVisible}
      pFunction={() => {
        // handleFilter();
        setFilterModalVisible(!filterModalVisible);
      }}
      nFunction={() => {
        setFilterModalVisible(!filterModalVisible);
      }}
    />
  );
}

const styles = StyleSheet.create({
  filterContent: {
    marginBottom: 15,
    marginHorizontal: 10,
  },
  filterElement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 30,
  },
  dateText: {
    fontSize: 16,
    color: '#000000',
  },
});

export default FilterModal;
