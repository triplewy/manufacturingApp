import { GET_TOTAL_STATS, GET_TOTAL_STATS_SUCCESS, GET_TOTAL_STATS_FAILURE } from './totalStats.actions'

const initialState = {
  loading: false,
  fetched: false,
  downtime: 0,
  error: ''
}

export function totalStats(state = initialState, action) {
  switch (action.type) {
    case GET_TOTAL_STATS:
      return {
        ...state,
        loading: true,
        fetched: false
      }
    case GET_TOTAL_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        fetched: true,
        downtime: action.downtime
      }
    case GET_TOTAL_STATS_FAILURE:
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
