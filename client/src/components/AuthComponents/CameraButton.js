import React, {useState} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  ActionSheetIOS,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import DoubleModal from '../common/DoubleModal';
import CameraModal from './CameraModal';
// const reference = storage().ref('/directory/filename.png');
// await reference.putFile(uri);
// const url = await reference.getDownloadURL();

const CameraButton = ({response, setResponse, uid}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const imagePickerOption = {
    mediaType: 'photo',
    maxWidth: 768,
    maxHeight: 768,
    inculdeBase64: Platform.OS === 'android',
  };
  const onPickImage = res => {
    if (res.didCancel || !res) {
      return;
    }
    console.log(res);
    setResponse(res);
  };
  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };
  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const onPress = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
      return;
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'Upload Picture',
        options: ['Take Photo', 'Choose From Library', 'Cancel'],
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
      <View style={[styles.wrapper]}>
        <Pressable style={styles.circle} onPress={onPress}>
          {response ? (
            <Image
              style={styles.circle}
              source={{uri: response?.assets[0]?.uri}}
            />
          ) : (
            <Icon name="person-add" color="#ffffff" size={28} />
          )}
        </Pressable>
      </View>
      <CameraModal
        text="미팅을 생성하시겠습니까?"
        //body={<Text>정말로?</Text>}
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pFunction={() => {}}
        nFunction={() => {
          setModalVisible(!modalVisible);
        }}
        onLaunchCamera={onLaunchCamera}
        onLaunchImageLibrary={onLaunchImageLibrary}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
    marginBottom: 20,
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

export default CameraButton;
