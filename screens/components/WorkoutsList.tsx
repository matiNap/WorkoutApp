import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import WorkoutItem from './WorkoutItem';
import { useSelector } from 'react-redux';
import { RootState } from '_rootReducer';
import reactotron from 'reactotronConfig';

const WorkoutsList = () => {
  const workouts = useSelector((state: RootState) => state.workouts);

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Workouts: </Text>
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {workouts.map((workout) => (
          <WorkoutItem title={workout.name} divider />
        ))}
      </ScrollView>
    </View>
  );
};

export default WorkoutsList;

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
