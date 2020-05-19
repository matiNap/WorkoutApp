import { REHYDRATE } from 'redux-persist/es/constants';

interface AppState {}

const initState: AppState = {};

export default (state = initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      return { ...state };
    }
    default:
      return { ...state };
  }
};
