import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import WorkoutItem from './WorkoutItem';
import Animated from 'react-native-reanimated';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import { workout } from '_types';

interface Props {
  setEditOpened?: (value: boolean) => void;
  editOpened?: boolean;
  transitionValue?: Animated.Node<number>;
  workouts?: workout[];
  onPress: (workoutId: string) => void;
}

const WorkoutsList = ({ setEditOpened, editOpened, transitionValue, workouts, onPress }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Workouts: </Text>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {workouts &&
          workouts.map((workout) => (
            <TouchableWithoutFeedback
              onPress={() => {
                if (onPress && !editOpened) onPress(workout.id);
              }}
              onLongPress={() => {
                if (setEditOpened) setEditOpened(true);
              }}
            >
              <WorkoutItem
                title={workout.name}
                divider
                key={workout.id}
                id={workout.id}
                {...{ editOpened, transitionValue }}
                closeEdit={() => {
                  if (setEditOpened) setEditOpened(false);
                }}
                length={workouts.length}
                time={workout.time}
                type={workout.type}
              />
            </TouchableWithoutFeedback>
          ))}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    workouts: state.workouts,
  };
};

export default connect(mapStateToProps)(WorkoutsList);

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});
