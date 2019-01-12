import { getGrid, getGridSuccess, getGridFailure, setLineIndex, setActiveLine, removeActiveLine, changeActiveMachine, setExpire  } from './grid.actions'
import { getRequest } from '../Storage'
import { fetchSetActiveLine, fetchDeleteActiveLine, fetchNotifyMechanic } from '../api'

export function setLine(index) {
  return (dispatch) => {
    dispatch(setLineIndex(index))
    return Promise.resolve()
  }
}

export function insertActiveLine(lineId, machineId) {
  return (dispatch) => {
    return new Promise(function(resolve, reject) {
      fetchSetActiveLine(lineId, machineId).then(data => {
        dispatch(setActiveLine(lineId, machineId, data.expireDate))
        return resolve()
      }).catch(err => {
        return reject(err);
      })
    })
  }
}

export function deleteActiveLine(lineId) {
  return (dispatch) => {
    return new Promise(function(resolve, reject) {
      fetchDeleteActiveLine().then(data => {
        if (data.message === 'success') {
          dispatch(removeActiveLine())
        }
        return resolve()
      }).catch(err => {
        return reject(err)
      })
    })
  }
}

export function notifyMechanic() {
  return (dispatch) => {
    return new Promise(function(resolve, reject) {
      fetchNotifyMechanic().then(data => {
        if (data.expireDate) {
          dispatch(setExpire(data.expireDate))
        }
        return resolve()
      }).catch(err => {
        return reject(err)
      })
    })
  }
}
