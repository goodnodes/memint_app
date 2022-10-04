import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

/*
  props 필요 없음
  Ex)
  <BackButton />
*/

function CloseButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.pop()}>
      <Icon name="close" size={20} color={'#ffffff'} />
      {/* <Text style={styles.buttonText}>Back</Text> */}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  backButton: {
    // alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default CloseButton;
