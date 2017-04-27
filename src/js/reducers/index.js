// @flow
import { combineReducers } from 'redux';
import comics from '../container/App/reducers/comics';

const rootReducer = combineReducers({
  comics,
});

export default rootReducer;
