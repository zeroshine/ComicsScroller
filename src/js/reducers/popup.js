// @flow
import { combineReducers } from 'redux';
import popup from '../container/PopUpApp/reducers/popup';

const rootReducer = combineReducers({
  popup,
});

export default rootReducer;
