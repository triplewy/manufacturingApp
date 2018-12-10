import {combineReducers} from 'redux';
import { auth } from './api.reducer'
import { grid } from '../../Grid/grid.reducer'

export default combineReducers({
  grid
});
