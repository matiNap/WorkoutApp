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
    <View style={styles.container}>
      {workouts && workouts.length !== 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: 1000 }}>
          {workouts &&
            workouts.map((workout, index) => (
              <WorkoutItem
                title={workout.name}
                key={workout.id}
                id={workout.id}
                {...{ editOpened, transitionValue, index, onPress, setEditOpened }}
                closeEdit={() => {
                  if (setEditOpened) setEditOpened(false);
                }}
                length={workouts.length}
                time={workout.time}
                type={workout.type}
              />
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
  container: { flex: 1, paddingHorizontal: 15 },

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
