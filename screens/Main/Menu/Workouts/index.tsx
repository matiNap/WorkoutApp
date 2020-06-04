import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import palette from '_palette';
import WorkoutsList from '_components/WorkoutsList';
import { Easing } from 'react-native-reanimated';
import AddWorkout from './components/AddWorkout';
import { useTransition, useSpringTransition } from 'react-native-redash';
import LeftEditButton from './components/LeftEditButton';
import { useNavigation } from '@react-navigation/native';

const Workouts = () => {
  const [editOpened, setEditOpened] = useState(false);
  const transitionValue = useSpringTransition(editOpened, {
    // duration: 300,
    easing: Easing.inOut(Easing.exp),
  });
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <WorkoutsList
        {...{ setEditOpened, editOpened, transitionValue }}
        onPress={(workoutId) => navigate('Creator', { id: workoutId })}
      />
      <AddWorkout {...{ transitionValue }} />

      <LeftEditButton
        {...{
          transitionValue,
          onPress: () => setEditOpened(false),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.secondary,
    paddingTop: StatusBar.currentHeight + 15,
    paddingHorizontal: 10,
  },
});

export default Workouts;
