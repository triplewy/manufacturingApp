import { combineReducers } from 'redux';
import { grid } from '../Grid/grid.reducer'
import { splash } from '../Splash/splash.reducer'
import { account } from '../Account/account.reducer'
import { stats } from '../Stats/stats.reducer'
import { totalStats } from '../Stats/TotalStats/totalStats.reducer'
import { downtimeStats } from '../Stats/DowntimeStats/downtimeStats.reducer'
import { machineStats } from '../Stats/MachineStats/machineStats.reducer'
import { shiftStats } from '../Stats/ShiftStats/shiftStats.reducer'

export default combineReducers({
  grid,
  splash,
  account,
  stats,
  totalStats,
  downtimeStats,
  machineStats,
  shiftStats
});
