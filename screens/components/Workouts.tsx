import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import WorkoutItem from './WorkoutItem';

const Workouts = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Workouts: </Text>
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutItem title="Back" divider time={3723} />
        <WorkoutItem title="Back" divider time={3720} />
        <WorkoutItem title="Back" divider time={3600} />
        <WorkoutItem title="Back" divider time={4000} />

        <WorkoutItem title="Back" />
      </ScrollView>
    </View>
  );
};

export default Workouts;

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
