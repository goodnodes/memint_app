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
  TouchableNativeFeedback,
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
import {data} from '../../assets/docs/contents';

function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}

function EditMyInfo({route, navigation}) {
  const [property, setProperty] = useState(route.params.property);
  const [selfIntroduction, setSelfIntroduction] = useState(
    route.params.selfIntroduction,
  );
  const [profileImg, setProfileImg] = useState(route.params.picture);
  const {showToast} = useToast();
  const {editUserInfo} = useAuthActions();

  const handleSubmit = () => {
    if (
      property.mbti === '' ||
      property.emoji === '' ||
      property.region.length === 0 ||
      property.favYoutube === '' ||
      property.twinCeleb === '' ||
      property.drinkCapa === '' ||
      property.drinkStyle.length === 0 ||
      property.alcoholType.length === 0 ||
      property.curfew === '' ||
      property.favGame.length === 0 ||
      selfIntroduction === ''
    ) {
      showToast('error', 'Please fill out all information.');
    } else {
      EditUserInfo(route.params.id, profileImg, property, selfIntroduction);
      editUserInfo({
        ...route.params,
        property: {...property},
        selfIntroduction: selfIntroduction,
        picture: profileImg,
      });
      showToast('success', 'Successfully edited.');
      navigation.pop();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeStatusBar />
      <FocusAwareStatusBar
        backgroundColor="#3C3D43"
        barStyle="light-content"
        animated={true}
      />
      <View style={styles.header}>
        <BackButton />
        {Platform.OS === 'android' ? (
          <TouchableNativeFeedback onPress={handleSubmit}>
            <Text style={styles.completeText}>Edit</Text>
          </TouchableNativeFeedback>
        ) : (
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.completeText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollview}
        contentContainerStyle={styles.paddingBottom}>
        <Text style={styles.title}>Edit My Info</Text>
        <ChangeProfile
          profile={profileImg}
          setProfile={setProfileImg}
          uid={route.params.id}
        />

        <View style={styles.li}>
          <Text style={styles.liText}>Nickname</Text>
          <BorderedInput
            size="wide"
            placeholder={route.params.nickName}
            editable={false}
          />
        </View>
        <View style={styles.li}>
          <Text style={styles.liText}>Self Infroduction</Text>
          <BorderedInput
            size="wide"
            defaultValue={selfIntroduction}
            value={selfIntroduction}
            onChangeText={setSelfIntroduction}
            multiline={true}
          />
        </View>
        <View style={styles.li}>
          <Text style={styles.liText}>MBTI</Text>
          <SelectDropdown
            data={data.mbti}
            onSelect={(selectedItem, index) => {
              setProperty({...property, mbti: selectedItem});
            }}
            defaultButtonText={property.mbti}
            buttonStyle={styles.dropdown}
            dropdownStyle={styles.dropdownStyle}
            rowTextStyle={styles.dropdownTextStyle}
            buttonTextStyle={styles.buttonTextStyle}
          />
        </View>
        <View style={styles.li}>
          <Text style={styles.liText}>Favorite Place</Text>
          <View style={styles.tagsContainer}>
            {data.region.map((tag, idx) => (
              <TagElement
                key={idx}
                tag={tag}
                property={property}
                setProperty={setProperty}
                type="region"
                selectLimit={3}
              />
            ))}
          </View>
        </View>
        <View style={styles.li}>
          <Text style={styles.liText}>Favorite Channel</Text>
          <BorderedInput
            size="wide"
            defaultValue={property.favYoutube}
            value={property.favYoutube}
            onChangeText={value => {
              setProperty({...property, favYoutube: value});
            }}
          />
        </View>
        <View style={styles.li}>
          <Text style={styles.liText}>Twin Celebrity</Text>
          <BorderedInput
            size="wide"
            defaultValue={property.twinCeleb}
            value={property.twinCeleb}
            onChangeText={value => {
              setProperty({...property, twinCeleb: value});
            }}
          />
        </View>
        <View style={styles.li}>
          <Text style={styles.liText}>Drink</Text>
          <SelectDropdown
            data={data.drinkCapa}
            onSelect={(selectedItem, index) => {
              setProperty({...property, drinkCapa: selectedItem});
            }}
            defaultButtonText={property.drinkCapa}
            buttonStyle={styles.dropdown}
            dropdownStyle={styles.dropdownStyle}
            rowTextStyle={styles.dropdownTextStyle}
            buttonTextStyle={styles.buttonTextStyle}
          />
        </View>

        <View style={styles.li}>
          <Text style={styles.liText}>Favorite Liquor</Text>
          <View style={styles.tagsContainer}>
            {data.alcoholType.map((tag, idx) => (
              <TagElement
                key={idx}
                tag={tag}
                property={property}
                setProperty={setProperty}
                type="alcoholType"
                selectLimit={3}
              />
            ))}
          </View>
        </View>
        <View style={styles.li}>
          <Text style={styles.liText}>Party Style</Text>
          <View style={styles.tagsContainer}>
            {data.drinkStyle.map((tag, idx) => (
              <TagElement
                key={idx}
                tag={tag}
                property={property}
                setProperty={setProperty}
                type="drinkStyle"
                selectLimit={1}
              />
            ))}
          </View>
        </View>
        <View style={styles.li}>
          <Text style={styles.liText}>Curfew</Text>
          <View style={styles.tagsContainer}>
            {data.curfew.map((tag, idx) => (
              <TagElement
                key={idx}
                tag={tag}
                property={property}
                setProperty={setProperty}
                type="curfew"
                selectLimit={1}
              />
            ))}
          </View>
        </View>
        <View style={styles.li}>
          <Text style={styles.liText}>Favorite Game</Text>
          <View style={styles.tagsContainer}>
            {data.favGame.map((tag, idx) => (
              <TagElement
                key={idx}
                tag={tag}
                property={property}
                setProperty={setProperty}
                type="favGame"
                selectLimit={3}
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
    paddingHorizontal: 15,
  },
  container: {
    backgroundColor: '#3C3D43',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingRight: 20,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '400',
    fontSize: 24,
    marginVertical: 20,
    color: '#ffffff',
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: -0.5,
  },

  ul: {
    marginTop: 10,
  },
  li: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  liText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  liGrayText: {
    fontSize: 16,
    color: '#868686',
  },
  dropdown: {
    width: '100%',
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
    height: 220,
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
  paddingBottom: {
    paddingBottom: 50,
  },
});

export default EditMyInfo;
