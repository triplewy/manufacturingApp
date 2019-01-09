import { sessionLogin, sessionLoginSuccess, sessionLoginFailure } from './splash.actions'
import { setNameIndex } from '../Name/name.actions'
import { setShifts } from '../Shifts/shifts.actions'
import { setActiveLine } from '../Grid/grid.actions'
import { getNameStorage } from '../Storage'
import API from '../api'

const api = new API()

export function fetchSessionLogin() {
  return (dispatch) => {
    dispatch(sessionLogin())
    return api.sessionLogin()
    .then(data => {
      if (data.message === 'not logged in') {
        dispatch(sessionLoginFailure(data.message))
      } else {
        for (var i = 0; i < data.lines.length; i++) {
          data.lines[i].name = 'LINE ' + data.lines[i].name
        }
        return getNameStorage().then(index => {
          dispatch(setNameIndex(index))
          dispatch(setShifts(data.shifts))
          dispatch(sessionLoginSuccess(data.lines, data.machines, data.names))
          if (data.activeLine) {
            dispatch(setActiveLine(data.activeLine.lineId, data.activeLine.machineId, data.activeLine.expire))
          }
        })
      }
    })
    .catch((error) => {
      dispatch(sessionLoginFailure(error))
    })
  }
}
