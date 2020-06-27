import React from 'react';
import { StyleSheet } from 'react-native';
import typography from '_typography';
import palette from '_palette';
import { exercise, exerciseType } from 'types';
import { editExercise } from '_actions/creators/workout';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import _ from 'lodash';
import TimeSelector from '_components/TimeSelector';
import ValueSelector from '_components/ValueSelector';
import { fromTimer } from '_helpers';

interface Props {
  opened: boolean;
  close: () => void;
  exerciseId: string;
  name: string;
  workoutId: string;
  editExercise: typeof editExercise;
  type: exerciseType;
  updateLocalExercise: (index: number | string, update: exercise) => void;
  value: number;
}

const EditValue = ({ opened, type, close, workoutId, exerciseId, value, ...props }: Props) => {
  if (type !== 'reps') {
    return (
      <TimeSelector
        {...{ opened }}
        setOpened={close}
        title="Time: "
        initValue={value}
        onConfirm={(m, s) => {
          const updated = { value: fromTimer(m, s) };
          props.editExercise(workoutId, exerciseId, updated);
          props.updateLocalExercise(exerciseId, updated);
        }}
      />
    );
  } else {
    return (
      <ValueSelector
        {...{ opened }}
        setOpened={close}
        initValue={value}
        title="Reps: "
        onConfirm={(value) => {
          const updated = { value };
          props.editExercise(workoutId, exerciseId, updated);
          props.updateLocalExercise(exerciseId, updated);
        }}
      />
    );
  }
};

const mapStateToProps = (state: RootState, ownProps: Props) => {
  const { exerciseId, workoutId } = ownProps;

  if (exerciseId) {
    const { exercises } = state.workouts[
      _.findIndex(state.workouts, ({ id: currentId }) => currentId === workoutId)
    ];

    const exercise: exercise = exercises[_.findIndex(exercises, { id: exerciseId })];

    return {
      type: exercise.type,
      value: exercise.value,
    };
  } else return {};
};

export default connect(mapStateToProps, {
  editExercise,
})(EditValue);

const styles = StyleSheet.create({
  textInput: {
    fontSize: typography.fontSize.normal,
    color: palette.text.primary,
    flex: 1,
    fontFamily: typography.fonts.primary,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 5,
    height: 20,
  },

  editTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    height: 30,
  },
});
