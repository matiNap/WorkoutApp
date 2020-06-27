import * as types from '_actions/workout';
import { workout } from '_types';
import _ from 'lodash';
import reactotron from 'reactotron-react-native';

const initState: workout[] = [];

const updateArray = (array: any[], id: string, data: any) => {
  const ar = array.map(({ id: currentId, ...item }) => {
    if (currentId === id) {
      return {
        id,
        ...item,
        ...data,
      };
    }

    return { id: currentId, ...item };
  });

  return ar;
};

const removeWorkout = (workouts: workout[], id: string) => {
  const arr = workouts;
  _.remove(arr, ({ id: currentId }: workout) => currentId === id);

  return arr;
};

export default (state = initState, action) => {
  switch (action.type) {
    case types.DELETE_WORKOUT:
      return [...removeWorkout(state, action.payload)];
    case types.LOAD_WORKOUT:
      return [...action.payload];
    case types.CREATE_WORKOUT:
      return [...state, action.payload];
    case types.UPDATE_WORKOUT: {
      const { id, data } = action.payload;
      const arr = updateArray(state, id, data);

      return [...arr];
    }

    default:
      return [...state];
  }
};
