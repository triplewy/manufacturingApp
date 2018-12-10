import { GET_DOWNTIME_STATS, GET_DOWNTIME_STATS_SUCCESS, GET_DOWNTIME_STATS_FAILURE } from './downtimeStats.actions'

const initialState = {
  loading: false,
  fetched: false,
  downtime: [],
  totalDowntime: 0,
  average: 0,
  error: ''
}

export function downtimeStats(state = initialState, action) {
  switch (action.type) {
    case GET_DOWNTIME_STATS:
      return {
        ...state,
        loading: true,
        fetched: false
      }
    case GET_DOWNTIME_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        fetched: true,
        downtime: action.downtime,
        totalDowntime: action.totalDowntime,
        average: action.average
      }
    case GET_DOWNTIME_STATS_FAILURE:
      return {
        ...state,
        loading: false,
        fetched: true,
        error: action.error
      }
    default:
      return state
  }
}
