import { signup, signupFailure, setUsername, setPassword, setConfirmPassword } from './createAccount.actions'
import API from '../api'

const api = new API()

export function username(username) {
  return (dispatch) => {
    dispatch(setUsername(username))
  }
}

export function password(password) {
  return (dispatch) => {
    dispatch(setPassword(password))
  }
}

export function confirmPassword(password) {
  return (dispatch) => {
    dispatch(setConfirmPassword(password))
  }
}

export function signupUser(username, password, confirmPassword, navigation) {
  return (dispatch) => {
    dispatch(signup())
    return api.signUp({ username: username, password: password })
    .then(data => {
      if (data.message === 'success') {
        navigation.navigate('Name')
      } else {
        dispatch(signupFailure(data.message))
      }
    })
    .catch(function(err) {
      dispatch(signupFailure(err))
    })
  }
}
