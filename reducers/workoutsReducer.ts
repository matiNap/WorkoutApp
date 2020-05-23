import * as types from '_actions/workout';
import { workout } from '_types';

const initState: workout[] = [];

export default (state = initState, action) => {
  switch (action.type) {
    case types.LOAD_WORKOUT:
      return [...action.payload];
    case types.CREATE_WORKOUT:
      return [...state];
    case types.UPDATE_WORKOUT:
      return [...state];

    default:
      return [...state];
  }
};
