import { combineReducers } from 'redux';
import { grid } from '../Grid/grid.reducer'
import { splash } from '../Splash/splash.reducer'
import { account } from '../Account/account.reducer'

export default combineReducers({
  grid,
  splash,
  account
});
