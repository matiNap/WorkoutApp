import * as types from '_actions/workout';
import { workout } from '_types';
import reactotron from 'reactotron-react-native';

const initState: workout[] = [];

const updateArray = (array: any[], id: number, data: any) => {
  return array.map((item, index) => {
    if (index === id - 1) {
      return {
        ...item,
        ...data,
      };
    }

    return item;
  });
};

export default (state = initState, action) => {
  switch (action.type) {
    case types.LOAD_WORKOUT:
      return [...action.payload];
    case types.CREATE_WORKOUT:
      return [...state, action.payload];
    case types.UPDATE_WORKOUT: {
      const { id, data } = action.payload;
      return updateArray(state, id, data);
    }

    default:
      return [...state];
  }
};
