export const GET_GRID = 'GET_GRID'
export const GET_GRID_SUCCESS = 'GET_GRID_SUCCESS'
export const GET_GRID_FAILURE = 'GET_GRID_FAILURE'

export const SET_GRID_LINE_INDEX = 'SET_GRID_LINE_INDEX'

export const ADD_ACTIVE_LINE = 'ADD_ACTIVE_LINE'
export const REMOVE_ACTIVE_LINE = 'REMOVE_ACTIVE_LINE'
export const CHANGE_ACTIVE_MACHINE = 'CHANGE_ACTIVE_MACHINE'
export const SET_EXPIRE = 'SET_EXPIRE'

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
    type: SET_GRID_LINE_INDEX,
    index: index
  }
}

export function setActiveLine(lineId, machineId, expireDate) {
  return {
    type: ADD_ACTIVE_LINE,
    lineId: lineId,
    machineId: machineId,
    expireDate: expireDate
  }
}

export function removeActiveLine() {
  return {
    type: REMOVE_ACTIVE_LINE
  }
}

export function changeActiveMachine(machineId) {
  return {
    type: CHANGE_ACTIVE_MACHINE,
    machineId: machineId
  }
}

export function setExpire(expire) {
  return {
    type: SET_EXPIRE,
    expire: expire
  }
}
