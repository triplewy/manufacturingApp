import { getStats, getStatsSuccess, getStatsFailure } from './workerStats.actions'
import { getRequest } from '../../Storage'

export function fetchWorkerStats(lineId, timePeriod, date) {
  return (dispatch) => {
    dispatch(getStats())
    var url = '/api/stats/downtime/line=' + lineId + '/timePeriod=' + timePeriod + '/workers'
    if (date) {
      url += '/date=' + date
    }
    return getRequest(global.API_URL + url)
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
