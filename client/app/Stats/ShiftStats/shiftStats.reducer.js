import { GET_SHIFT_STATS, GET_SHIFT_STATS_SUCCESS, GET_SHIFT_STATS_FAILURE } from './shiftStats.actions'

const initialState = {
  loading: false,
  fetched: false,
  downtime: [],
  totalDowntime: 0,
  error: ''
}

export function shiftStats(state = initialState, action) {
  switch (action.type) {
    case GET_SHIFT_STATS:
      return {
        ...state,
        loading: true,
        fetched: false
      }
    case GET_SHIFT_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        fetched: true,
        downtime: action.downtime,
        totalDowntime: action.totalDowntime
      }
    case GET_SHIFT_STATS_FAILURE:
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
