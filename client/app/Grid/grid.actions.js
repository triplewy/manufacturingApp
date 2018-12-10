export const GET_GRID = 'GET_GRID'
export const GET_GRID_SUCCESS = 'GET_GRID_SUCCESS'
export const GET_GRID_FAILURE = 'GET_GRID_FAILURE'

export const GET_LINE = 'GET_LINE'
export const GET_LINE_SUCCESS = 'GET_LINE_SUCCESS'
export const GET_LINE_FAILURE = 'GET_LINE_FAILURE'

export const SET_LINE_INDEX = 'SET_LINE_INDEX'

export function getGrid() {
  return {
    type: GET_GRID
  }
}

export function getGridSuccess(data) {
  return{
    type: GET_GRID_SUCCESS,
    data: data
  }
}

export function getGridFailure(error) {
  return{
    type: GET_GRID_SUCCESS,
    error: error
  }
}

export function getLines() {
  return {
    type: GET_LINE
  }
}

export function getLinesSuccess(lines) {
  return{
    type: GET_LINE_SUCCESS,
    lines: lines
  }
}

export function getLinesFailure(error) {
  return{
    type: GET_LINE_SUCCESS,
    error: error
  }
}

export function setLineIndex(index) {
  return{
    type: SET_LINE_INDEX,
    index: index
  }
}
