import {
  getAccount, getAccountSuccess, getAccountFailure,
  getStoredName, getStoredNameSuccess, getStoredNameFailure,
  logout, logoutFailure,
  setStoredName, setStoredNameFailure
} from './account.actions'
import { setNameIndex } from '../Name/name.actions'
import { sessionLoginSuccess } from '../Splash/splash.actions'
import { setNameStorage } from '../Storage'
import API from '../api'

const api = new API()

export function fetchAccount() {
  return (dispatch) => {
    dispatch(getAccount())
    return api.account()
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
    return api.logout()
    .then(data => {
      if (data.message === 'success') {
        return setNameStorage('-1').then(data => {
          if (data.message === 'success') {
            navigation.navigate('Auth')
            dispatch(sessionLoginSuccess([], [], []))
            dispatch(setNameIndex(-1))
          } else {
            dispatch(setStoredNameFailure())
            navigation.navigate('Auth')
          }
        })

      } else {
        dispatch(logoutFailure(data.message))
      }
    })
    .catch((error) => {
      dispatch(logoutFailure(error))
    })
  }
}

export function changeName(navigation) {
  return (dispatch) => {
    dispatch(setStoredName())
    return setNameStorage('-1').then(data => {
      if (data.message === 'success') {
        navigation.navigate('Name')
        dispatch(setNameIndex(-1))
      } else {
        dispatch(setStoredNameFailure())
      }
    })
    .catch(err => {
      dispatch(setStoredNameFailure())
    })
  }
}
