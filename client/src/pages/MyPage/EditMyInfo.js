import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  ActionSheetIOS,
  KeyboardAvoidingView,
  StatusBar,
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
import SafeStatusBar from '../../components/common/SafeStatusBar';
import {useIsFocused} from '@react-navigation/native';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

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
    <KeyboardAvoidingView style={styles.container}>
      <SafeStatusBar />
      <FocusAwareStatusBar
        backgroundColor="#3C3D43"
        barStyle="light-content"
        animated={true}
      />
      <View style={styles.header}>
        <BackButton />
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.completeText}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollview}>
        <Text style={styles.title}>내 정보 수정</Text>
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
    </KeyboardAvoidingView>
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
    paddingRight: 15,
    alignItems: 'center',
    // borderBottomColor: 'gray',
    // borderBottomWidth: 1,
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginTop: 10,
    marginLeft: 15,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },

  ul: {
    marginTop: 10,
  },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  liColumn: {
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  liText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  liGrayText: {
    fontSize: 16,
    color: '#868686',
  },
  dropdown: {
    width: '50%',
    borderColor: '#EAFFEF',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 99,
    height: 36,
    backgroundColor: '#EAFFEF',
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
  completeText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
});

export default EditMyInfo;
