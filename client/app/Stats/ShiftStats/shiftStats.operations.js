import { getStats, getStatsSuccess, getStatsFailure } from './shiftStats.actions'
import API from '../../api'

const api = new API()

export function fetchShiftStats(lineId, timePeriod, date) {
  return (dispatch) => {
    dispatch(getStats())
    return api.statsShifts(lineId, timePeriod, date)
    .then(data => {
      var totalDowntime = 0
      for (var i = 0; i < data.length; i++) {
        totalDowntime += data[i].totalDowntime
      }
      dispatch(getStatsSuccess(data, totalDowntime))
    })
    .catch((error) => {
      dispatch(getStatsFailure(error))
    });
  }
}
