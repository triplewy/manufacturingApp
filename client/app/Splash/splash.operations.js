import { sessionLogin, sessionLoginSuccess, sessionLoginFailure } from './splash.actions'
import { setNameIndex } from '../Name/name.actions'
import { getRequest, getNameStorage } from '../Storage'

export function fetchSessionLogin() {
  return (dispatch) => {
    dispatch(sessionLogin())
    return getRequest(global.API_URL + '/api/sessionLogin')
    .then(data => {
      if (data.message === 'not logged in') {
        dispatch(sessionLoginFailure(data.message))
      } else {
        for (var i = 0; i < data.lines.length; i++) {
          data.lines[i].name = 'LINE ' + data.lines[i].name
        }
        return getNameStorage().then(index => {
          console.log('index is', index);
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
