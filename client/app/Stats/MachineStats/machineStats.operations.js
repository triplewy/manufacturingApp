import { getStats, getStatsSuccess, getDayStatsSuccess, getStatsFailure } from './machineStats.actions'
import { fetchStatsMachines } from '../../api'

export function fetchMachineStats(lineId, timePeriod, date) {
  return (dispatch) => {
    dispatch(getStats())
    return fetchStatsMachines(lineId, timePeriod, date)
    .then(data => {
      var totalDowntime = 0
      for (var i = 0; i < data.length; i++) {
        totalDowntime += data[i].totalDowntime
      }
      if (date) {
        dispatch(getDayStatsSuccess(data, totalDowntime))
      } else {
        dispatch(getStatsSuccess(data, totalDowntime))
      }
    })
    .catch((error) => {
      dispatch(getStatsFailure(error))
    });
  }
}
