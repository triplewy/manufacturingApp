import { sessionLogin, sessionLoginSuccess, sessionLoginFailure } from './splash.actions'
import { setNameIndex } from '../Name/name.actions'
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
          dispatch(sessionLoginSuccess(data.lines, data.machines, data.names))
        })
      }
    })
    .catch((error) => {
      dispatch(sessionLoginFailure(error))
    })
  }
}
