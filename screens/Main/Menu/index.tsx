import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import palette from '_palette';
import WorkoutsList from '_components/WorkoutsList';
import AddWorkout from './components/AddWorkout';
import { useSpringTransition } from 'react-native-redash';
import HideIcon from '_components/HideIcon';
import { useNavigation } from '@react-navigation/native';
import Header from '_components/Header';
import Back from '_components/Back';
import { Text } from 'react-native-elements';
import typography from '_typography';

const Workouts = () => {
  const [editOpened, setEditOpened] = useState(false);
  const transitionValue = useSpringTransition(editOpened, {});
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <Header style={{ backgroundColor: 'transparent', justifyContent: 'flex-start' }}>
        <Back
          onPress={() => {
            navigate('Start');
          }}
        />
        <Text style={styles.title}>Workouts:</Text>
      </Header>
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
  },
  title: {
    fontSize: typography.fontSize.header,
    marginLeft: 10,
  },
});

export default Workouts;
