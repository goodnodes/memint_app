import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import RoomTab from './RoomTab';
const {height} = Dimensions.get('window');

function BottomDrawer() {
  const DrawerState = {
    Open: height - height / 1.7,
    // Peek: 230,
    Closed: 0,
  };

  const getNextState = (currentState, val, margin) => {
    switch (currentState) {
      // case DrawerState.Peek:
      //   return val >= currentState + margin
      //     ? DrawerState.Open
      //     : val <= DrawerState.Peek - margin
      //     ? DrawerState.Closed
      //     : DrawerState.Peek;
      case DrawerState.Open:
        return val >= currentState ? DrawerState.Open : DrawerState.Closed;
      // ? DrawerState.Closed
      // : DrawerState.Peek;
      case DrawerState.Closed:
        return val >= currentState + margin
          ? // ? val <= DrawerState.Peek + margin
            //   ? DrawerState.Peek
            //   :
            DrawerState.Open
          : DrawerState.Closed;
      default:
        return currentState;
    }
  };

  const animateMove = (y, toValue, callback) => {
    Animated.spring(y, {
      toValue: -toValue,
      tension: 20,
      useNativeDriver: true,
    }).start(finished => {
      /* Optional: But the purpose is to call this after the the animation has finished. Eg. Fire an event that will be listened to by the parent component */
      finished && callback && callback();
    });
  };

  /* Declare initial value of y. In this case, we want it to be closed when the component is closed */
  const y = React.useRef(new Animated.Value(DrawerState.Closed)).current;
  /* Declare another variable to keep track of the state. We need a separate variable for this because y will also change whilst the user is in the process of moving the drawer up or down */
  const state = React.useRef(new Animated.Value(DrawerState.Closed)).current;
  const margin = 0.05 * height;
  const movementValue = moveY => height - moveY;
  /* This event is triggered when the animated view is moving. We want the user to be able to drag/swipe up or down and the drawer should move simultaneously. */
  const onPanResponderMove = (_, {moveY}) => {
    const val = movementValue(moveY);
    animateMove(y, val);
  };
  /* Here is where we snap the drawer to the desired state - open, peek or closed */
  const onPanResponderRelease = (_, {moveY}) => {
    const valueToMove = movementValue(moveY);
    const nextState = getNextState(state._value, valueToMove, margin);
    state.setValue(nextState);
    animateMove(y, nextState);
  };
  /* This determines if the responder should do something. In this scenario, it is set to true when the distance moved by Y is greater than or equal to 10, or lesser than or equal to -10. */
  const onMoveShouldSetPanResponder = (_, {dy}) => Math.abs(dy) >= 10;
  /* Here we're creating a panResponder object and assigning th event handlers to it. */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder,
      onStartShouldSetPanResponderCapture: onMoveShouldSetPanResponder,
      onPanResponderMove,
      onPanResponderRelease,
    }),
  ).current;

  //   useState(() => {
  // console.log(state._value)
  //   },[state._value])

  return (
    <Animated.View
      style={[
        {
          width: '100%',
          height: height,
          borderRadius: 25,
          position: 'absolute',
          bottom: -height + height * 0.23,
          transform: [{translateY: y}],
          backgroundColor: '#3C3D43',
        },
      ]}
      /* Refers to the PanResponder created above */
      {...panResponder.panHandlers}>
      <View style={styles.barRow}>
        <View style={styles.bar} />
      </View>
      <RoomTab tabActive={true} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  barRow: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bar: {
    backgroundColor: '#EAFFEFCC',
    width: 72,
    height: 6,
    borderRadius: 999,
    marginTop: 13,
    marginBottom: 5,
    marginHorizontal: 3,
  },
});

export default BottomDrawer;
