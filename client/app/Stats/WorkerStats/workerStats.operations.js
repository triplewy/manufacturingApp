import { getStats, getStatsSuccess, getStatsFailure } from './workerStats.actions'
import API from '../../api'

const api = new API()

export function fetchWorkerStats(lineId, timePeriod, date) {
  return (dispatch) => {
    dispatch(getStats())
    // var url = '/api/stats/downtime/line=' + lineId + '/timePeriod=' + timePeriod + '/workers'
    // if (date) {
    //   url += '/date=' + date
    // }
    return api.statsWorkers(lineId, timePeriod, date)
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
