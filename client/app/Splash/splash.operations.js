import { sessionLogin, sessionLoginSuccess, sessionLoginFailure } from './splash.actions'
import { getRequest } from '../Storage'

export function fetchSessionLogin() {
  return (dispatch) => {
    dispatch(sessionLogin())
    return getRequest(global.API_URL + '/api/sessionLogin')
    .then(data => {
      if (data.message === 'not logged in') {
        dispatch(sessionLoginFailure())
      } else {
        for (var i = 0; i < data.lines.length; i++) {
          data.lines[i].name = 'LINE ' + data.lines[i].name
        }
        dispatch(sessionLoginSuccess(data.lines, data.machines))
      }
    })
    .catch((error) => {
      dispatch(sessionLoginFailure())
    })
  }
}
