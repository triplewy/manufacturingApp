import { getStats, getStatsSuccess, getStatsFailure } from './workerStats.actions'
import { fetchStatsWorkers } from '../../api'

export function fetchWorkerStats(lineId, timePeriod, date) {
  return (dispatch) => {
    dispatch(getStats())
    return fetchStatsWorkers(lineId, timePeriod, date)
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
