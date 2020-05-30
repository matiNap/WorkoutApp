import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolate } from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import palette from '_palette';
import metrics from '_metrics';
import { createWorkout } from '_actions/creators/workout';
import { connect } from 'react-redux';

interface Props {
  transitionValue: Animated.Node<number>;
  createWorkout: typeof createWorkout;
}

const ADD_SIZE = metrics.width * 0.17;
const ADD_X_POS = 30;

const AddWorkout = ({ transitionValue, ...props }: Props) => {
  const navigation = useNavigation();
  const addOffsetX = interpolate(transitionValue, {
    inputRange: [0, 1],
    outputRange: [0, ADD_SIZE + ADD_X_POS],
  });
  return (
    <Animated.View
      style={[
        styles.addContainer,
        { transform: [{ translateX: addOffsetX }] },
      ]}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          props.createWorkout();
          navigation.navigate('Creator', { add: true });
        }}
      >
        <MaterialIcons name="add" style={styles.addIcon} />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default connect(null, { createWorkout })(AddWorkout);

const styles = StyleSheet.create({
  addContainer: {
    backgroundColor: palette.primary,
    width: ADD_SIZE,
    height: ADD_SIZE,
    justifyContent: 'center',
    borderRadius: ADD_SIZE,
    position: 'absolute',
    bottom: 30,
    right: ADD_X_POS,
  },
  addIcon: {
    fontSize: 35,
    color: palette.text.primary,
    alignSelf: 'center',
  },
});
