import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Image, Text} from 'react-native';
import useUser from '../../utils/hooks/UseUser';
import tingsymbol from '../../assets/icons/tingsymbol.png';

/*
props 필요 없음.
<WalletButton />
*/

function WalletButton() {
  const navigation = useNavigation();
  const userInfo = useUser();
  return (
    <TouchableOpacity
      // style={styles.walletButton}
      onPress={() => navigation.navigate('Wallet')}>
      {/* <Text style={styles.buttonText}>Wallet</Text> */}
      <View style={styles.walletButton}>
        <Image source={tingsymbol} style={styles.image} />
        <Text style={styles.buttonText}>{userInfo?.tokenAmount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  walletButton: {
    // position: 'absolute',
    width: 60,
    height: 28,
    // left: 0,
    // top: 0,
    backgroundColor: '#3C3D43',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#58FF7D',
    borderWidth: 1,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#58FF7D',
    fontSize: 16,
    marginLeft: 4,
    letterSpacing: -0.5,
  },
  image: {
    width: 18,
    height: 18,
  },
});

export default WalletButton;
