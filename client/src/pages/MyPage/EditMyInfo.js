import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import BackButton from '../../components/common/BackButton';

import SelectDropdown from 'react-native-select-dropdown';
import TagElement from '../../components/myPageComponent/TagElement';
import BorderedInput from '../../components/AuthComponents/BorderedInput';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import ChangeProfile from '../../components/myPageComponent/ChangeProfile';
import {useToast} from '../../utils/hooks/useToast';
import {EditUserInfo} from '../../lib/Users';
import useAuthActions from '../../utils/hooks/UseAuthActions';
function EditMyInfo({route, navigation}) {
  const [drinkInfo, setDrinkInfo] = useState(route.params.property);
  const [selfIntro, setSelfIntro] = useState(route.params.selfIntroduction);
  const [profileImg, setProfileImg] = useState(route.params.picture);
  const {showToast} = useToast();
  const {editUserInfo} = useAuthActions();
  const tagData = {
    alcoholType: [
      '소주',
      '맥주',
      '보드카',
      '칵테일',
      '고량주',
      '막걸리',
      '와인',
    ],
    drinkStyle: [
      '진지한 분위기를 좋아해요. 함께 이야기 나눠요!',
      '신나는 분위기를 좋아해요. 친해져요!',
      '일단 마시고 생각하자구요. 부어라 마셔라!',
      '안주보다 술이 좋아요',
      '술보다 안주가 좋아요.',
    ],
  };
  // useEffect(() => {
  //   console.log(drinkInfo);
  // }, []);

  const handleSubmit = () => {
    if (
      drinkInfo.drinkCapa === '' ||
      drinkInfo.alcoholType.length === 0 ||
      drinkInfo.drinkStyle.length === 0
    ) {
      showToast('error', '필수 항목들을 작성해주세요');
    } else {
      EditUserInfo(route.params.id, profileImg, drinkInfo, selfIntro);
      editUserInfo({
        ...route.params,
        property: {...drinkInfo},
        selfIntroduction: selfIntro,
        picture: profileImg,
      });
      showToast('success', '내 정보가 수정되었습니다.');
      navigation.pop();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.flexRow}>
          <BackButton />
          <Text style={styles.title}>내 정보 수정</Text>
        </View>
        <View>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.title}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollview}>
        <ChangeProfile
          profile={profileImg}
          setProfile={setProfileImg}
          uid={route.params.id}
        />

        <View style={styles.liColumn}>
          <Text style={{...styles.liText, marginBottom: 10}}>닉네임</Text>
          <BorderedInput
            size="wide"
            placeholder={route.params.nickName}
            editable={false}
          />
        </View>
        <View style={styles.liColumn}>
          <Text style={{...styles.liText, marginBottom: 10}}>자기소개</Text>
          <BorderedInput
            size="wide"
            placeholder="자기소개를 입력해 주세요"
            value={selfIntro}
            onChangeText={setSelfIntro}
          />
        </View>

        <View style={styles.li}>
          <Text style={styles.liText}>주량</Text>
          <SelectDropdown
            data={[
              '한 잔만',
              '반 병 이하',
              '한 병 이하',
              '두 병 이하',
              '세 병 이하',
              '세 병 이상',
            ]}
            onSelect={(selectedItem, index) => {
              setDrinkInfo({...drinkInfo, drinkCapa: selectedItem});
            }}
            defaultButtonText={drinkInfo.drinkCapa}
            buttonStyle={styles.dropdown}
            dropdownStyle={styles.dropdownStyle}
            rowTextStyle={styles.dropdownTextStyle}
            buttonTextStyle={styles.buttonTextStyle}
          />
        </View>

        <View style={styles.liColumn}>
          <Text style={styles.liText}>선호하는 주류</Text>
          <View style={styles.tagsContainer}>
            {tagData.alcoholType.map((tag, idx) => (
              <TagElement
                key={idx}
                tag={tag}
                drinkInfo={drinkInfo.alcoholType}
                setDrinkInfo={setDrinkInfo}
                type="alcoholType"
                wholeInfo={drinkInfo}
              />
            ))}
          </View>
        </View>
        <View style={styles.liColumn}>
          <Text style={styles.liText}>음주 스타일</Text>
          <View style={styles.tagsContainer}>
            {tagData.drinkStyle.map((tag, idx) => (
              <TagElement
                key={idx}
                tag={tag}
                drinkInfo={drinkInfo.drinkStyle}
                setDrinkInfo={setDrinkInfo}
                type="drinkStyle"
                wholeInfo={drinkInfo}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    marginVertical: 20,
  },
  container: {
    backgroundColor: '#3C3D43',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingRight: 20,
    alignItems: 'center',
    height: 60,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    color: 'white',
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
  liColumn: {
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginVertical: 15,
  },
  liText: {
    color: 'white',
    fontSize: 16,
  },
  liGrayText: {
    fontSize: 16,
    color: '#868686',
  },
  dropdown: {
    fontSize: 10,
    width: 130,
    borderColor: '#bdbdbd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 30,
  },
  dropdownStyle: {
    backgroundColor: '#3C3D43',
    borderRadius: 10,
  },
  dropdownTextStyle: {
    color: '#ffffff',
    fontSize: 14,
  },
  buttonTextStyle: {
    color: '#1D1E1E',
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'black',
    opacity: 0.4,
    borderColor: '#AEFFC1',
  },
  tagsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default EditMyInfo;
