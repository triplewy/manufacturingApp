import { getStats, getStatsSuccess, getStatsFailure } from './downtimeStats.actions'
import { getRequest } from '../../Storage'

export function fetchDowntimeStats(lineId, timePeriod) {
  return (dispatch) => {
    dispatch(getStats())
    return getRequest(global.API_URL + '/api/stats/downtime/time/' + timePeriod + '/line/' + lineId)
    .then(data => {
      console.log(data);
      var downtime = []
      var average = 0
      for (var i = 0; i < data.length; i++) {
        downtime.push({time: data[i].time, downtime: data[i].totalDowntime, dateLabel: data[i].dateLabel, availableMin: data[i].availableMin})
        average += data[i].totalDowntime/data[i].availableMin
      }
      dispatch(getStatsSuccess(downtime, average, average/data.length))
    })
    .catch((error) => {
      dispatch(getStatsFailure(error))
    })

  }
}
