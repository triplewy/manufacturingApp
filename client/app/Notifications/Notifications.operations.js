import { getNotifications, getNotificationsSuccess, getNotificationsFailure } from './Notifications.actions'
import { getRequest } from '../Storage'
import API from '../api'

const api = new API()

export function fetchNotifications() {
  return (dispatch) => {
    dispatch(getNotifications())
    return api.notifications()
    .then(data => {
      dispatch(getNotificationsSuccess(data))
    })
    .catch((error) => {
      dispatch(getNotificationsFailure(error))
    })
  }
}
