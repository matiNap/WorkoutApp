import { combineReducers } from 'redux';
import AppReducer from './AppReducer';

const rootReducer = combineReducers({
  app: AppReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
