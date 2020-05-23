import { workout, workoutType, exercise } from '_types';
import * as types from '_actions/workout';
import _ from 'lodash';
import reactotron from 'reactotron-react-native';
import * as SQLite from 'expo-sqlite';

const FILE_NAME = 'workout_app.db';

const getDatabase = () => {
  return SQLite.openDatabase(FILE_NAME);
};

export const createWorkout = () => async (dispatch) => {
  createWorkoutTable();
  getDatabase().transaction(
    (tx) => {
      tx.executeSql(
        'insert into workouts (name,type,exerciseBreak,typeBreak,time,exercises) values ("Workout name","reps",0,0,0,"[]");',
      );
    },
    (error) => {
      reactotron.log(error.message);
    },
    ({ rows }) => {
      reactotron.log();
    },
  );
};

export const loadWorkouts = () => async (dispatch) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('select * from workouts ;', [], (_, { rows }) => {
      reactotron.log(rows);
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
    tx.executeSql('insert into workouts ');
  });
};

export const saveNameWorkout = (id: string, name: string) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update name set name = ? where id = ?', [
      name,
      id,
    ]);
  });
};

export const saveExercises = (id: string, exercises: exercise[]) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update name set exercises = ? where id = ?', [
      JSON.stringify(exercises),
      id,
    ]);
  });
};

export const saveTypeWorkout = (id: string, type: workoutType) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update name set type = ? where id = ?', [
      type,
      id,
    ]);
  });
};

export const saveValueWorkout = (id: string, value: number) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update name set value = ? where id = ?', [
      value,
      id,
    ]);
  });
};

export const saveExerciseBreak = (id: string, breakValue: string) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update name set exerciseBreak = ? where id = ?', [
      breakValue,
      id,
    ]);
  });
};

export const saveTypeBreak = (id: string, breakValue: string) => {
  getDatabase().transaction((tx) => {
    tx.executeSql('update name set typeBreak = ? where id = ?', [
      breakValue,
      id,
    ]);
  }, null);
};
