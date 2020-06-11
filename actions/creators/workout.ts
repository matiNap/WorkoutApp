import { workout, workoutType, exercise } from '_types';
import * as types from '_actions/workout';
import _ from 'lodash';
import reactotron from 'reactotron-react-native';
import * as SQLite from 'expo-sqlite';
import { RootState } from '_rootReducer';
import uid from 'uid';

const FILE_NAME = 'workout_app.db';

const getDatabase = () => {
  return SQLite.openDatabase(FILE_NAME);
};

export const createWorkout = () => async (dispatch, getState) => {
  createWorkoutTable();
  getDatabase().transaction((tx) => {
    const id = uid();
    tx.executeSql(
      'insert into workouts (name,type,exerciseBreak,typeBreak,time,exercises,id,loop) values ("Workout name","series",0,0,-1,"[]",?,1);',
      [id],
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
        workout_id: getState().workouts.length + 1,
        id,
      },
    });
  });
};

export const deleteWorkout = (id: string) => (dispatch) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('delete from workouts where id= ?;', [id]);
  });
  dispatch({ type: types.DELETE_WORKOUT, payload: id });
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
      'create table if not exists workouts(workout_id integer primary key not null,name string,type string,exercises string,exerciseBreak integer,typeBreak integer,time integer,id string,loop integer);',
    );
  });
};

export const saveNameWorkout = (id: string, name: string) => (dispatch) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update workouts set name = ? where id = ?', [name, id]);
  });

  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      data: {
        name,
      },
      id,
    },
  });
};

export const saveExercises = (id: string, exercises: exercise[]) => {
  reactotron.log(exercises);
  getDatabase().transaction((tx) => {
    tx.executeSql('update workouts set exercises = ? where id = ?', [
      JSON.stringify(exercises),
      id,
    ]);
  });
};

export const saveTypeWorkout = (id: string, type: workoutType) => (dispatch) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update workouts set type = ? where id = ?;', [type, id]);
  });
  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      id,
      data: {
        type,
      },
    },
  });
};

export const saveLoop = (id: string, value: number) => (dispatch, getState) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update workouts set loop = ? where id = ?', [value, id]);
  });
  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      data: {
        loop: value,
      },
      id,
    },
  });
  updateTime(id)(dispatch, getState);
};

export const saveExerciseBreak = (id: string, breakValue: number) => (dispatch, getState) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update workouts set exerciseBreak = ? where id = ?', [breakValue, id]);
  });
  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      data: {
        exerciseBreak: breakValue,
      },
      id,
    },
  });
  updateTime(id)(dispatch, getState);
};

export const saveTypeBreak = (id: string, breakValue: number) => (dispatch, getState) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update workouts set typeBreak = ? where id = ?', [breakValue, id]);
  });
  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      data: {
        typeBreak: breakValue,
      },
      id,
    },
  });
  updateTime(id)(dispatch, getState);
};

const getExercises = (getState: () => RootState, workoutId: string): exercise[] => {
  const { workouts } = getState();
  return workouts[_.findIndex(workouts, ({ id }) => id === workoutId)].exercises;
};

const mergeExercises = (getState: () => RootState, exc: exercise, workoutId: string) => {
  const currentExercises = getExercises(getState, workoutId);
  return [...currentExercises, exc];
};

export const addExercise = (workoutId: string, exercise: exercise) => (dispatch, getState) => {
  const newExercises = mergeExercises(getState, { ...exercise, id: uid() }, workoutId);

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
  updateTime(workoutId)(dispatch, getState);
};

export const editExercise = (workoutId: string, exerciseId: string, excUpdate: exercise) => (
  dispatch,
  getState: () => RootState,
) => {
  const currentExcs = getExercises(getState, workoutId);

  const updatedExc = currentExcs.map((item: exercise) => {
    if (item.id === exerciseId) {
      return {
        ...item,
        ...excUpdate,
      };
    }

    return item;
  });
  saveExercises(workoutId, updatedExc);

  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      data: {
        exercises: updatedExc,
      },
      id: workoutId,
    },
  });

  updateTime(workoutId)(dispatch, getState);
};

const updateTime = (workoutId: string) => (dispatch, getState: () => RootState) => {
  let time = -1;
  const { workouts } = getState();
  const currentWorkout: workout = workouts[_.findIndex(workouts, ({ id }) => id === workoutId)];
  const { exercises } = currentWorkout;

  for (let i = 0; i < exercises.length; i++) {
    if (exercises[i].type === 'reps') {
      time = -1;
      break;
    } else {
      if (time === -1) time = 0;
      time += exercises[i].value;
    }
  }
  console.log(time);
  if (time !== -1) {
    const { loop, exerciseBreak, typeBreak } = currentWorkout;
    time *= loop;
    const l = exercises.length;
    time += (l - 1) * loop * exerciseBreak + (loop - 1) * typeBreak;
  }
  getDatabase().transaction((tx) => {
    tx.executeSql('update workouts set time = ? where id = ?;', [time, workoutId]);
  });
  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      data: {
        time,
      },
      id: workoutId,
    },
  });
};

export const deleteExercise = (workoutId: string, exerciseId: string) => (dispatch, getState) => {
  const excs = getExercises(getState, workoutId);
  _.remove(excs, (item) => {
    if (item.id === exerciseId) {
      return true;
    }
  });
  saveExercises(workoutId, excs);

  dispatch({
    type: types.UPDATE_WORKOUT,
    payload: {
      data: {
        exercises: excs,
      },
      id: workoutId,
    },
  });
};
