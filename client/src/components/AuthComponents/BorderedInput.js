import React, {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';

const BorderedInput = (
  {hasMarginBottom, size, value, margin, ...rest},
  ref,
) => {
  const sizeStyle = SIZE[size];
  return (
    <TextInput
      style={[
        styles.input,
        hasMarginBottom && styles.margin,
        sizeStyle,
        value ? styles.border : null,
        {
          marginTop: margin ? margin[0] : 0,
          marginRight: margin ? margin[1] : 0,
          marginBottom: margin ? margin[2] : 0,
          marginLeft: margin ? margin[3] : 0,
        },
      ]}
      ref={ref}
      {...rest}
      autoComplete="off"
      autoCorrect={false}
      selectionColor="#AEFFC1"
      placeholderTextColor="#EAFFEFCC"
    />
  );
};

const SIZE = StyleSheet.create({
  small: {
    width: 70,
    height: 35,
  },
  medium: {
    width: 100,
    height: 40,
  },
  large: {
    width: 220,
    height: 40,
  },
  wide: {
    width: '100%',
    height: 42,
  },
});

const styles = StyleSheet.create({
  input: {
    borderColor: '#EAFFEFCC',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 5,
    height: 48,
    // backgroundColor: 'white',
    color: '#ffffff',
  },
  margin: {
    marginBottom: 16,
  },
  border: {
    borderColor: '#AEFFC1',
    borderWidth: 2,
  },
});
export default React.forwardRef(BorderedInput);
