import { combineReducers } from 'redux';
import theme from './themeReducer';
import filter from './filterReducer';

const rootReducer = combineReducers({
  theme,
  filter,
});

export default rootReducer;
