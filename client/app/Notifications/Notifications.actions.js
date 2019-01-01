export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS'
export const GET_NOTIFICATIONS_SUCCESS = 'GET_NOTIFICATIONS_SUCCESS'
export const GET_NOTIFICATIONS_FAILURE = 'GET_NOTIFICATIONS_FAILURE'

export function getNotifications() {
  return {
    type: GET_NOTIFICATIONS,
  }
}

export function getNotificationsSuccess(notifications) {
  return {
    type: GET_NOTIFICATIONS_SUCCESS,
    notifications: notifications
  }
}

export function getNotificationsFailure(error) {
  return {
    type: GET_NOTIFICATIONS_FAILURE,
    error: error
  }
}
