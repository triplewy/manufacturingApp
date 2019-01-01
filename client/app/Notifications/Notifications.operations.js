import { getNotifications, getNotificationsSuccess, getNotificationsFailure } from './Notifications.actions'
import { getRequest } from '../Storage'

export function fetchNotifications() {
  return (dispatch) => {
    dispatch(getNotifications())
    return getRequest(global.API_URL + '/api/account/notifications')
    .then(data => {
      dispatch(getNotificationsSuccess(data))
    })
    .catch((error) => {
      dispatch(getNotificationsFailure(error))
    })
  }
}
