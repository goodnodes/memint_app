import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import klayIcon from '../../assets/icons/klaytn-klay-logo.png';
import ethIcon from '../../assets/icons/ethereum.png';
import tingsymbol from '../../assets/icons/tingsymbol.png';

function WalletAccountElement({onPress, balance, content}) {
  const imgSrc = content === 'KLAY' ? klayIcon : tingsymbol;
  return (
    <TouchableOpacity onPress={() => onPress(content)}>
      <View style={[styles.button]}>
        <View style={styles.tokenWrapper}>
          <Image source={imgSrc} style={styles.icon} />
          <Text style={styles.contentText}>{content}</Text>
        </View>

        <Text style={styles.balanceText}>{balance}</Text>
      </View>
    </TouchableOpacity>
  );
}

WalletAccountElement.defaultProps = {
  width: 200,
  height: 40,
  borderColor: '#bdbddd',
  balance: 0,
  content: 'KLAY',
  onPress: () => {},
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    marginLeft: 20,
    // backgroundColor: 'green',
  },
  tokenWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  contentText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  balanceText: {
    marginRight: 30,
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 330,
    height: 52,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 3,
  },
});

export default WalletAccountElement;
