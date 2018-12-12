import { combineReducers } from 'redux';
import { login } from '../Login/login.reducer'
import { createAccount } from '../CreateAccount/createAccount.reducer'
import { grid } from '../Grid/grid.reducer'
import { splash } from '../Splash/splash.reducer'
import { account } from '../Account/account.reducer'
import { reports } from '../Reports/reports.reducer'
import { stats } from '../Stats/stats.reducer'
import { totalStats } from '../Stats/TotalStats/totalStats.reducer'
import { downtimeStats } from '../Stats/DowntimeStats/downtimeStats.reducer'
import { machineStats } from '../Stats/MachineStats/machineStats.reducer'
import { shiftStats } from '../Stats/ShiftStats/shiftStats.reducer'
import { input } from '../Input/input.reducer'

export default combineReducers({
  login,
  createAccount,
  grid,
  splash,
  account,
  reports,
  stats,
  totalStats,
  downtimeStats,
  machineStats,
  shiftStats,
  input
});
