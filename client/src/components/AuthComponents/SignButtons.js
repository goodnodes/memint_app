import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BasicButton from '../common/BasicButton';

const {width} = Dimensions.get('screen');

const SignButtons = ({onSubmitSignIn, onSubmitSignUp}) => {
  return (
    <View style={styles.buttons}>
      {/* <BasicButton
        style={styles.button}
        width={150}
        height={42}
        textSize={15}
        margin={[5, 5, 5, 5]}
        text="로그인"
        hasMarginBottom
        onPress={onSubmitSignIn}
        // onPress={onPressLogin}
      /> */}
      <TouchableOpacity onPress={onSubmitSignIn} style={styles.buttonWrapper}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>로그인</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSubmitSignUp} style={styles.buttonWrapper}>
        <View style={[styles.button, styles.buttonSignup]}>
          <Text style={[styles.buttonText, styles.buttonTextSignup]}>
            회원가입
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  buttonWrapper: {
    width: width * 0.438,
  },
  button: {
    width: '100%',
    height: 42,
    backgroundColor: '#AEFFC1',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#AEFFC1',
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1E1E',
    letterSpacing: -0.5,
    lineHeight: 21,
  },
  buttonSignup: {
    backgroundColor: 'transparent',
  },
  buttonTextSignup: {
    color: '#ffffff',
  },
});

export default SignButtons;
