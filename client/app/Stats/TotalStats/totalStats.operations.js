import { getStats, getStatsSuccess, getStatsFailure } from './totalStats.actions'
import { getRequest } from '../../Storage'

export function fetchTotalStats(lineId, timePeriod) {
  return (dispatch) => {
    dispatch(getStats())
    return getRequest(global.API_URL + '/api/stats/totalDowntime/' + timePeriod + '/' + lineId)
    .then(data => {
      console.log(data);
      dispatch(getStatsSuccess(data.totalDowntime))
    })
    .catch((error) => {
      dispatch(getStatsFailure(error))
    });
  }
}
