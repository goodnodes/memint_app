import React, {useRef} from 'react';
import BorderedInput from './BorderedInput';

const SignForm = ({onSubmit, form, createChangeTextHandler}) => {
  const passwordRef = useRef();

  return (
    <>
      <BorderedInput
        placeholder="Email"
        hasMarginBottom
        value={form.email}
        onChangeText={createChangeTextHandler('email')}
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="email"
        keyboardType="email-address"
        returnKeyType="next"
        margin={[0, 0, 8, 0]}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <BorderedInput
        placeholder="Password"
        value={form.password}
        onChangeText={createChangeTextHandler('password')}
        secureTextEntry
        margin={[0, 0, 0, 0]}
        ref={passwordRef}
        returnKeyType={'done'}
        onSubmitEditing={() => {
          onSubmit();
        }}
      />
    </>
  );
};

export default SignForm;
