import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import typography from '_typography';
import WorkoutsList from '_components/WorkoutsList';
import palette from '_palette';

export default function Selector() {
  const { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <WorkoutsList
        onPress={(workoutId) => {
          navigate('Timer', { workoutId });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 10,
    paddingHorizontal: 10,
    backgroundColor: palette.secondary,
  },
  header: { justifyContent: 'flex-start' },
  title: {
    marginLeft: 10,
    fontSize: typography.fontSize.medium,
  },
});
