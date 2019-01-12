import { getNotifications, getNotificationsSuccess, getNotificationsFailure } from './Notifications.actions'
import { getRequest } from '../Storage'
import { fetchNotifications } from '../api'

export function handleNotifications() {
  return (dispatch) => {
    dispatch(getNotifications())
    return fetchNotifications()
    .then(data => {
      dispatch(getNotificationsSuccess(data))
    })
    .catch((error) => {
      dispatch(getNotificationsFailure(error))
    })
  }
}
