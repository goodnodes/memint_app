import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

function TagElement({tag, property, setProperty, type, selectLimit}) {
  const handleClick = () => {
    if (property[type].includes(tag)) {
      setProperty({
        ...property,
        [type]: property[type].filter(el => el !== tag),
      });
    } else {
      if (type === 'drinkStyle') {
        setProperty({...property, drinkStyle: [tag]});
        return;
      }
      if (property[type].length >= selectLimit) {
        return;
      }
      const value = [...property[type], tag];
      setProperty({...property, [type]: value});
    }
  };
  return (
    <TouchableOpacity
      // style={[styles.tag, colored ? styles.coloredTag : '']}
      onPress={handleClick}>
      {property[type].includes(tag) ? (
        <View style={[styles.tag, styles.coloredTag]}>
          <Text style={styles.coloredtext}>{tag}</Text>
        </View>
      ) : (
        <View style={styles.tag}>
          <Text style={styles.text}>{tag}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#3C3D43',
    paddingVertical: 7,
    paddingHorizontal: 11,
    marginVertical: 4,
    borderRadius: 99,
    borderColor: 'transparent',
    borderWidth: 1,
    marginHorizontal: 4,
  },
  coloredTag: {
    borderColor: '#AEFFC1',
    borderWidth: 1,
  },
  coloredtext: {
    color: '#AEFFC1',
    fontSize: 16,
    letterSpacing: -0.5,
  },
  text: {
    color: '#EAFFEFCC',
    fontSize: 16,
    letterSpacing: -0.5,
  },
});

export default TagElement;
