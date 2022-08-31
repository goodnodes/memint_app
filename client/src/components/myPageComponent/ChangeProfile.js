import React, {useState} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  ActionSheetIOS,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const imagePickerOption = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  inculdeBase64: Platform.OS === 'android',
};

const ChangeProfile = ({profile, setProfile, uid}) => {
  const insets = useSafeAreaInsets();
  let photoURL = null;
  const onPickImage = async res => {
    if (res.didCancel || !res) {
      return;
    }
    const asset = res.assets[0];
    const extension = asset.fileName.split('.').pop(); //확장자 추출
    const reference = storage().ref(`/profile/${uid}.${extension}`);

    await reference.putFile(asset.uri);

    photoURL = res ? await reference.getDownloadURL() : null;
    setProfile(photoURL);
  };
  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };
  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const onPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: '사진 업로드',
        options: ['카메라로 촬영하기', '사진 선택하기', '취소'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          onLaunchCamera();
          console.log('카메라 촬영');
        } else if (buttonIndex === 1) {
          onLaunchImageLibrary();
          console.log('사진 선택');
        }
      },
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.li} onPress={onPress}>
        <Image
          style={styles.profileImage}
          source={{
            uri: profile,
          }}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    width: 100,
    marginLeft: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'black',
    opacity: 0.4,
    borderColor: '#AEFFC1',
  },
  wrapper: {
    marginTop: 30,
    marginBottom: 50,
    borderRadius: 54,
    height: 108,
    width: 108,

    ...Platform.select({
      ios: {
        shadowColor: '#4d4d4d',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  circle: {
    // backgroundColor: '#6200ee',
    borderRadius: 54,
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#AEFFC1',
  },
});

export default ChangeProfile;
