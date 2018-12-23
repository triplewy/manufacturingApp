export const SET_STATS_LINE_INDEX = 'SET_STATS_LINE_INDEX'
export const SET_STATS_NAME_INDEX = 'SET_STATS_NAME_INDEX'
export const SET_TIME_PERIOD = 'SET_TIME_PERIOD'

export function setLineIndex(index) {
  return{
    type: SET_STATS_LINE_INDEX,
    index: index
  }
}

export function setNameIndex(index) {
  return{
    type: SET_STATS_NAME_INDEX,
    index: index
  }
}

export function setTimePeriod(index) {
  return{
    type: SET_TIME_PERIOD,
    index: index
  }
}
