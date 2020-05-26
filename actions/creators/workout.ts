import { workout, workoutType, exercise } from '_types';
import * as types from '_actions/workout';
import _ from 'lodash';
import reactotron from 'reactotron-react-native';
import * as SQLite from 'expo-sqlite';
import { RootState } from '_rootReducer';

const FILE_NAME = 'workout_app.db';

const getDatabase = () => {
  return SQLite.openDatabase(FILE_NAME);
};

export const createWorkout = () => async (dispatch) => {
  createWorkoutTable();
  getDatabase().transaction((tx) => {
    tx.executeSql(
      'insert into workouts (name,type,exerciseBreak,typeBreak,time,exercises) values ("Workout name","series",0,0,0,"[]");',
    );
    dispatch({
      type: types.CREATE_WORKOUT,
      payload: {
        name: 'Workout name',
        type: 'series',
        exerciseBreak: 0,
        typeBreak: 0,
        exercises: [],
        time: 0,
      },
    });
  });
};

export const loadWorkouts = () => async (dispatch) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('select * from workouts', [], (_, { rows }) => {
      const array = rows._array;
      const data = array.map((currentWorkout) => {
        return {
          ...currentWorkout,
          exercises: JSON.parse(currentWorkout.exercises),
        };
      });
      dispatch({
        type: types.LOAD_WORKOUT,
        payload: data,
      });
    });
  });
};

export const createWorkoutTable = () => {
  getDatabase().transaction((tx) => {
    tx.executeSql(
      'create table if not exists workouts(workout_id integer primary key not null,name string,type string,exercises string,exerciseBreak integer,typeBreak integer,time number);',
    );
  });
};

export const saveNameWorkout = (id: number, name: string) => (
  dispatch,
) => {
  getDatabase().transaction(
    (tx) => {
      tx.executeSql(
        'update workouts set name = ? where workout_id = ?',
        [name, id],
      );
    },
    () => {},
    () => {
      dispatch({
        type: types.UPDATE_WORKOUT,
        payload: {
          data: {
            name,
          },
          id,
        },
      });
    },
  );
};

export const saveExercises = (id: number, exercises: exercise[]) => {
  getDatabase().transaction((tx) => {
    tx.executeSql(
      'update workouts set exercises = ? where workout_id = ?',
      [JSON.stringify(exercises), id],
    );
  });
};

export const saveTypeWorkout = (id: number, type: workoutType) => (
  dispatch,
) => {
  getDatabase().transaction(
    (tx) => {
      tx.executeSql(
        'update workouts set type = ? where workout_id = ?;',
        [type, id],
      );
    },
    (error) => {
      reactotron.log(error.message);
    },
    () => {
      dispatch({
        type: types.UPDATE_WORKOUT,
        payload: {
          id,
          data: {
            type,
          },
        },
      });
    },
  );
};

export const saveValueWorkout = (id: number, value: number) => {
  getDatabase().transaction((tx) => {
    tx.executeSql(
      'update workouts set value = ? where workout_id = ?',
      [value, id],
    );
  });
};

export const saveExerciseBreak = (id: number, breakValue: number) => (
  dipsatch,
) => {
  getDatabase().transaction(
    (tx) => {
      tx.executeSql(
        'update workouts set exerciseBreak = ? where workout_id = ?',
        [breakValue, id],
      );
    },
    (error) => {
      console.log(error.message);
    },
    () => {
      dipsatch({
        type: types.UPDATE_WORKOUT,
        payload: {
          data: {
            exerciseBreak: breakValue,
          },
          id,
        },
      });
    },
  );
};

export const saveTypeBreak = (id: number, breakValue: number) => (
  dipsatch,
) => {
  getDatabase().transaction(
    (tx) => {
      tx.executeSql(
        'update workouts set typeBreak = ? where workout_id = ?',
        [breakValue, id],
      );
    },
    (error) => {
      console.log(error.message);
    },
    () => {
      dipsatch({
        type: types.UPDATE_WORKOUT,
        payload: {
          data: {
            typeBreak: breakValue,
          },
          id,
        },
      });
    },
  );
};

const mergeExercises = (
  getState: () => RootState,
  exc: exercise,
  workoutId: number,
) => {
  const { workouts } = getState();
  const currentExercises = workouts[workoutId - 1].exercises;
  return [...currentExercises, exc];
};

export const addExercise = (
  workoutId: number,
  exercise: exercise,
) => (dispatch, getState) => {
  const newExercises = mergeExercises(getState, exercise, workoutId);
  saveExercises(workoutId, newExercises);

  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      id: workoutId,
      data: {
        exercises: newExercises,
      },
    },
  });
};

export const editExercise = (
  workoutId: number,
  exerciseId: string,
  excUpdate: exercise,
) => (dispatch, getState: () => RootState) => {
  const { workouts } = getState();
  const currentExcs = workouts[workoutId - 1].exercises;
  const updatedExc = currentExcs.map((item: exercise) => {
    if (item.id === exerciseId) {
      return {
        ...item,
        excUpdate,
      };
    }

    return item;
  });
  // saveExercises(
  //   workoutId,
  //   mergeExercises(getState, updatedExc, workoutId),
  // );
  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      data: {
        exercises: updatedExc,
        id: workoutId,
      },
    },
  });
};
