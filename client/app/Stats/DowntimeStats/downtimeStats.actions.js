export const GET_DOWNTIME_STATS = 'GET_DOWNTIME_STATS'
export const GET_DOWNTIME_STATS_SUCCESS = 'GET_DOWNTIME_STATS_SUCCESS'
export const GET_DOWNTIME_STATS_FAILURE = 'GET_DOWNTIME_STATS_FAILURE'

export function getStats() {
  return{
    type: GET_DOWNTIME_STATS,
  }
}

export function getStatsSuccess(downtime, totalDowntime, average) {
  return{
    type: GET_DOWNTIME_STATS_SUCCESS,
    downtime: downtime,
    totalDowntime: totalDowntime,
    average: average
  }
}

export function getStatsFailure(error) {
  return{
    type: GET_DOWNTIME_STATS_FAILURE,
    error: error
  }
}
