import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

/*
  props 필요 없음
  Ex)
  <BackButton />
*/

function CloseButton() {
  const navigation = useNavigation();
  return (
    <View style={styles.closeButtonRow}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.pop()}>
        <Icon name="close" size={20} color={'#ffffff'} />
        {/* <Text style={styles.buttonText}>Back</Text> */}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  closeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 10
  },
  backButton: {
    // alignItems: 'center',
    paddingLeft: 15,
    // paddingRight: 10,
    paddingTop: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default CloseButton;
