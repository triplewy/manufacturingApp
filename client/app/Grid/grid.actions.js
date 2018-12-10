export const GET_GRID = 'GET_GRID'
export const GET_GRID_SUCCESS = 'GET_GRID_SUCCESS'
export const GET_GRID_FAILURE = 'GET_GRID_FAILURE'

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

export function setLineIndex(index) {
  return{
    type: SET_LINE_INDEX,
    index: index
  }
}
