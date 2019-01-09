import { GET_MACHINE_STATS, GET_MACHINE_STATS_SUCCESS, GET_DAY_MACHINE_STATS_SUCCESS, GET_MACHINE_STATS_FAILURE } from './machineStats.actions'

const initialState = {
  loading: false,
  fetched: false,
  downtime: [],
  totalDowntime: 0,
  dayDowntime: [],
  dayTotalDowntime: 0,
  error: ''
}

export function machineStats(state = initialState, action) {
  switch (action.type) {
    case GET_MACHINE_STATS:
      return {
        ...state,
        loading: true,
        fetched: false
      }
    case GET_MACHINE_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        fetched: true,
        downtime: action.downtime,
        totalDowntime: action.totalDowntime
      }
    case GET_DAY_MACHINE_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        fetched: true,
        dayDowntime: action.downtime,
        dayTotalDowntime: action.totalDowntime
      }
    case GET_MACHINE_STATS_FAILURE:
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
