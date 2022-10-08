import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

/*

  BasicButton 사용법

  props
  text => 버튼 내용
  width =>
  height =>
  backgroundcolor =>
  margin => [top, right, bottom, left]
  //지정안하면 basic으로
  onPress => 실행 함수

  Ex)
    <BasicButton
    text="버튼"
    width={100}
    height={40}
    textSize={14}
    backgroundColor="blue"
    textColor = 'white'
    margin={[10, 3, 3, 3]}
    borderRadius={10}
    onPress={onPress}
    border={true}
  />

*/

function BasicButton({
  text,
  backgroundColor,
  width,
  height,
  textSize,
  margin,
  onPress,
  textColor,
  borderRadius,
  border,
  disabled,
}) {
  const [marginTop, marginRight, marginBottom, marginLeft] = margin;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={width === '100%' ? {width: '100%'} : null}>
      <View
        style={[
          styles.button,
          {
            width: width,
            height: height,
            backgroundColor: backgroundColor,
            marginTop: marginTop,
            marginRight: marginRight,
            marginBottom: marginBottom,
            marginLeft: marginLeft,
            borderRadius: borderRadius,
          },
          border ? styles.border : '',
        ]}>
        <Text
          style={[styles.buttonText, {fontSize: textSize, color: textColor}]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

BasicButton.defaultProps = {
  width: 100,
  height: 40,
  backgroundColor: '#AEFFC1',
  textColor: '#1D1E1E',
  text: '버튼',
  textSize: 14,
  margin: [5, 5, 5, 5],
  onPress: () => {},
  borderRadius: 30,
  border: true,
  disabled: false,
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    margin: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  border: {
    borderWidth: 1,
    borderColor: '#AEFFC1',
  },
});

export default BasicButton;
