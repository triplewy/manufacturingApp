import {
  getAccount, getAccountSuccess, getAccountFailure,
  getStoredName, getStoredNameSuccess, getStoredNameFailure,
  logout, logoutFailure,
  setStoredName, setStoredNameFailure
} from './account.actions'
import { setNameIndex } from '../Name/name.actions'
import { sessionLoginSuccess } from '../Splash/splash.actions'
import { setNameStorage } from '../Storage'
import { fetchAccount, fetchLogout } from '../api'

export function handleAccount() {
  return (dispatch) => {
    dispatch(getAccount())
    return fetchAccount().then(data => {
      dispatch(getAccountSuccess(data))
    }).catch((error) => {
      dispatch(getAccountFailure(error))
    })
  }
}

export function handleLogout(navigation) {
  return (dispatch) => {
    dispatch(logout())
    return fetchLogout().then(data => {
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
