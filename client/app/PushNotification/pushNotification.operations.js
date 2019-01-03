import { PushNotificationIOS } from 'react-native'
import { getBadge, setBadge } from './PushNotification.actions'
import { setDeviceTokenRegistered } from '../Storage'
import API from '../api'

const api = new API()

export function postToken(token) {
  return api.deviceToken({ token: token })
  .then(data => {
    if (data.message == 'success') {
      setDeviceTokenRegistered()
    } else {
      console.log(data.message);
    }
  })
  .catch(function(err) {
    console.log(err);
  })
}

export function fetchBadge() {
  return (dispatch) => {
    return new Promise(function(resolve, reject) {
      PushNotificationIOS.getApplicationIconBadgeNumber(function(badge) {
        dispatch(getBadge(badge))
        return resolve()
      })
    })
  }
}

export function applyBadge(badge) {
  return (dispatch) => {
    PushNotificationIOS.setApplicationIconBadgeNumber(badge)
    dispatch(setBadge(badge))
  }
}

export function readNotifications() {
  return (dispatch) => {
    return api.readNotifications()
    .then(data => {
      if (data.message === 'success') {
        dispatch(applyBadge(0))
      } else {
        console.log(data);
      }
    })
  }
}
