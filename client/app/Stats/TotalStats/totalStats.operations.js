import { getStats, getStatsSuccess, getStatsFailure } from './totalStats.actions'
import { fetchTotalDowntime } from '../../api'

export function fetchTotalStats(lineId, timePeriod) {
  return (dispatch) => {
    dispatch(getStats())
    return fetchTotalDowntime(lineId, timePeriod)
    .then(data => {
      dispatch(getStatsSuccess(data.totalDowntime))
    })
    .catch((error) => {
      dispatch(getStatsFailure(error))
    });
  }
}
