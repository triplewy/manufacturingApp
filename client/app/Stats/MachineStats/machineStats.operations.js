import { getStats, getStatsSuccess, getStatsFailure } from './machineStats.actions'
import { getRequest } from '../../Storage'

export function fetchMachineStats(lineId, timePeriod, date) {
  return (dispatch) => {
    dispatch(getStats())
    var url = '/api/stats/downtime/machines/time=' + timePeriod + '/line=' + lineId
    if (date) {
      url += '/' + date
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
