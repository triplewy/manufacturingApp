export const GET_WORKER_STATS = 'GET_WORKER_STATS'
export const GET_WORKER_STATS_SUCCESS = 'GET_WORKER_STATS_SUCCESS'
export const GET_WORKER_STATS_FAILURE = 'GET_WORKER_STATS_FAILURE'

export function getStats() {
  return{
    type: GET_WORKER_STATS,
  }
}

export function getStatsSuccess(downtime, totalDowntime) {
  return{
    type: GET_WORKER_STATS_SUCCESS,
    downtime: downtime,
    totalDowntime: totalDowntime
  }
}

export function getStatsFailure(error) {
  return{
    type: GET_WORKER_STATS_FAILURE,
    error: error
  }
}
