export const GET_SHIFT_STATS = 'GET_SHIFT_STATS'
export const GET_SHIFT_STATS_SUCCESS = 'GET_SHIFT_STATS_SUCCESS'
export const GET_SHIFT_STATS_FAILURE = 'GET_SHIFT_STATS_FAILURE'

export function getStats() {
  return{
    type: GET_SHIFT_STATS,
  }
}

export function getStatsSuccess(downtime, totalDowntime) {
  return{
    type: GET_SHIFT_STATS_SUCCESS,
    downtime: downtime,
    totalDowntime: totalDowntime
  }
}

export function getStatsFailure(error) {
  return{
    type: GET_SHIFT_STATS_FAILURE,
    error: error
  }
}
