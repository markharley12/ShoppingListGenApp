// reducers/index.js
import { combineReducers } from 'redux';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  settings: settingsReducer,
  // Add more reducers here if needed
});

export default rootReducer;
