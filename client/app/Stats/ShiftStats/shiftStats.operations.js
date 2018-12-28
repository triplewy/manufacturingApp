import { getStats, getStatsSuccess, getStatsFailure } from './shiftStats.actions'
import { getRequest } from '../../Storage'

export function fetchShiftStats(lineId, timePeriod, date) {
  return (dispatch) => {
    dispatch(getStats())
    return getRequest(global.API_URL + '/api/stats/downtime/line=' + lineId + '/timePeriod=' + timePeriod + '/shifts/date=' + date)
    .then(data => {
      console.log(data);
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
