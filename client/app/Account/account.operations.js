import {
  getAccount, getAccountSuccess, getAccountFailure,
  getStoredName, getStoredNameSuccess, getStoredNameFailure,
  logout, logoutFailure,
  setStoredName, setStoredNameFailure
} from './account.actions'
import { sessionLoginSuccess } from '../Splash/splash.actions'
import { getRequest, postRequest, getName, setName } from '../Storage'

export function fetchAccount() {
  return (dispatch) => {
    dispatch(getAccount())
    return getRequest(global.API_URL + '/api/account')
    .then(data => {
      dispatch(getAccountSuccess(data))
    })
    .catch((error) => {
      dispatch(getAccountFailure(error))
    })
  }
}

export function fetchLogout(navigation) {
  return (dispatch) => {
    dispatch(logout())
    return postRequest(global.API_URL + '/api/auth/logout')
    .then(data => {
      console.log(data);
      if (data.message === 'success') {
        dispatch(sessionLoginSuccess([], []))
        navigation.navigate('Auth')
      } else {
        dispatch(logoutFailure(data.message))
      }
    })
    .catch((error) => {
      dispatch(logoutFailure(error))
    })
  }
}

export function fetchName() {
  return (dispatch) => {
    dispatch(getStoredName())
    return getName().then(name => {
      dispatch(getStoredNameSuccess(name))
    })
    .catch(err => {
      dispatch(getStoredNameFailure(err))
    })
  }
}

export function changeName(navigation) {
  return (dispatch) => {
    dispatch(setStoredName())
    return setName('').then(data => {
      if (data.message === 'success') {
        navigation.navigate('Name')
      } else {
        dispatch(setStoredNameFailure())
      }
    })
    .catch(err => {
      dispatch(setStoredNameFailure())
    })
  }
}
