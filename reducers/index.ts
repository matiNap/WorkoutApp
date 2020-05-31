import { combineReducers } from 'redux';
import AppReducer from './AppReducer';
import workoutsReducer from './workoutsReducer';

const rootReducer = combineReducers({
  app: AppReducer,
  workouts: workoutsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
