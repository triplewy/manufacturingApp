export const GET_TOTAL_STATS = 'GET_TOTAL_STATS'
export const GET_TOTAL_STATS_SUCCESS = 'GET_TOTAL_STATS_SUCCESS'
export const GET_TOTAL_STATS_FAILURE = 'GET_TOTAL_STATS_FAILURE'

export function getStats() {
  return{
    type: GET_TOTAL_STATS,
  }
}

export function getStatsSuccess(data) {
  return{
    type: GET_TOTAL_STATS_SUCCESS,
    downtime: data
  }
}

export function getStatsFailure(error) {
  return{
    type: GET_TOTAL_STATS_FAILURE,
    error: error
  }
}
