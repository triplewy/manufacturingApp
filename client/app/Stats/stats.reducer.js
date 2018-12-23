import { SET_STATS_LINE_INDEX, SET_STATS_NAME_INDEX, SET_TIME_PERIOD } from './stats.actions'

const initialState = {
  lineIndex: 0,
  nameIndex: 0,
  timePeriod: 1,
  refreshing: false
}

export function stats(state = initialState, action) {
  switch (action.type) {
    case SET_STATS_LINE_INDEX:
      return {
        ...state,
        lineIndex: action.index,
      }
    case SET_STATS_NAME_INDEX:
      return {
        ...state,
        nameIndex: action.index,
      }
    case SET_TIME_PERIOD:
      return {
        ...state,
        timePeriod: action.index
      }
    default:
      return state
  }
}
