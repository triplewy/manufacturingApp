import { getGrid, getGridSuccess, getGridFailure, setLineIndex, setActiveLine, removeActiveLine, changeActiveMachine  } from './grid.actions'
import { getRequest } from '../Storage'
import API from '../api'

const api = new API()

export function setLine(index) {
  return (dispatch) => {
    dispatch(setLineIndex(index))
    return Promise.resolve()
  }
}

export function insertActiveLine(lineId, machineId) {
  return (dispatch) => {
    return new Promise(function(resolve, reject) {
      api.handleInput(lineId, machineId)
      .then(data => {
        dispatch(setActiveLine(lineId, machineId, data.expireDate))
        return resolve()
      })
      .catch(err => {
        console.log(err);
      })
    })
  }
}

export function deleteActiveLine(lineId) {
  return (dispatch) => {
    dispatch(removeActiveLine(lineId))
  }
}

export function setActiveMachine(machineId) {
  return (dispatch) => {
    dispatch(changeActiveMachine(machineId))
  }
}
