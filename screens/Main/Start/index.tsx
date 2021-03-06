import React, { useState, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import palette from '_palette';
import metrics from '_metrics';
import Notify from '_components/Notify';
import { useSelector } from 'react-redux';
import { RootState } from '_rootReducer';

interface Props {
  navigation: any;
}

const Start = ({ navigation }: Props) => {
  const [opened, setOpened] = useState(false);
  const workouts = useSelector((state: RootState) => state.workouts);
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (workouts.length !== 0) navigation.navigate('Workout');
          else setOpened(true);
        }}
      >
        <View style={styles.startButton}>
          <Text style={styles.text}>START</Text>
        </View>
      </TouchableWithoutFeedback>
      <Notify content="You have no workouts yet" close={() => setOpened(false)} opened={opened} />
    </View>
  );
};

export default Start;
const START_BUTTON_SIZE = metrics.width * 0.6;

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.secondary,
    flex: 1,
    justifyContent: 'center',
  },
  startButton: {
    width: START_BUTTON_SIZE,
    height: START_BUTTON_SIZE,
    borderRadius: START_BUTTON_SIZE,
    backgroundColor: palette.actions.succes,
    shadowColor: palette.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    fontSize: 40,
    alignSelf: 'center',
    color: palette.text.primary,
  },
  overlay: {
    width: metrics.width * 0.85,
    minHeight: metrics.height * 0.55,
  },
});
