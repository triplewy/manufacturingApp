export const GET_MACHINE_STATS = 'GET_MACHINE_STATS'
export const GET_MACHINE_STATS_SUCCESS = 'GET_MACHINE_STATS_SUCCESS'
export const GET_MACHINE_STATS_FAILURE = 'GET_MACHINE_STATS_FAILURE'

export function getStats() {
  return{
    type: GET_MACHINE_STATS,
  }
}

export function getStatsSuccess(downtime, totalDowntime) {
  return{
    type: GET_MACHINE_STATS_SUCCESS,
    downtime: downtime,
    totalDowntime: totalDowntime
  }
}

export function getStatsFailure(error) {
  return{
    type: GET_MACHINE_STATS_FAILURE,
    error: error
  }
}
