import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import palette from '_palette';
import WorkoutsList from '_components/WorkoutsList';
import AddWorkout from './components/AddWorkout';
import { useSpringTransition } from 'react-native-redash';
import HideIcon from '_components/HideIcon';
import { useNavigation } from '@react-navigation/native';

const Workouts = () => {
  const [editOpened, setEditOpened] = useState(false);
  const transitionValue = useSpringTransition(editOpened, {});
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <WorkoutsList
        {...{ setEditOpened, editOpened, transitionValue }}
        onPress={(workoutId) => navigate('Creator', { id: workoutId })}
      />
      <AddWorkout {...{ transitionValue }} />

      <HideIcon
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
