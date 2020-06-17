import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import WorkoutItem from './WorkoutItem';
import Animated from 'react-native-reanimated';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import { workout } from '_types';
import metrics from '_metrics';
import palette from '_palette';

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
      {workouts && workouts.length !== 0 ? (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {workouts &&
            workouts.map((workout) => (
              <TouchableWithoutFeedback
                key={workout.id}
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
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.subText}>Create your first workout</Text>
        </View>
      )}
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
  placeholder: {
    position: 'absolute',
    alignSelf: 'center',
    top: metrics.height / 3,
  },
  subText: {
    color: palette.text.gray,
  },
});
