import { getUser, getUserSuccess, getUserFailure, setUsername, setPassword } from './login.actions'
import { sessionLoginSuccess } from '../Splash/splash.actions'
import { postRequest } from '../Storage'

export function username(username){
  return (dispatch) => {
    dispatch(setUsername(username))
  }
}

export function password(password){
  return (dispatch) => {
    dispatch(setPassword(password))
  }
}

export function loginUser(username, password, navigation) {
  return (dispatch) => {
    dispatch(getUser())
    return postRequest(global.API_URL + '/api/auth/signin', {
      username: username,
      password: password
    })
    .then(data => {
      if (data.message === 'not logged in') {
        dispatch(getUserFailure(data.message))
      } else {
        for (var i = 0; i < data.lines.length; i++) {
          data.lines[i].name = 'LINE ' + data.lines[i].name
        }
        dispatch(sessionLoginSuccess(data.lines, data.machines))
        dispatch(getUserSuccess())
        navigation.navigate('Name')
      }
    })
    .catch(function(err) {
      dispatch(getUserFailure(err))
    })
  }
}
