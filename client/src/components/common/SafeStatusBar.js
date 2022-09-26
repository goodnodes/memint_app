import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {StatusBar, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}
function SafeStatusBar() {
  const {top} = useSafeAreaInsets();

  return (
    <>
      <FocusAwareStatusBar barStyle="light-content" />
      <View style={{backgroundColor: '#3D3E44', height: top}} />
    </>
  );
}

export default SafeStatusBar;
