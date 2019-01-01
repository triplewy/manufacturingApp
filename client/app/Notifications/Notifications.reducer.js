import { GET_NOTIFICATIONS, GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_FAILURE } from './Notifications.actions'

const initialState = {
  loading: false,
  notifications: [],
  error: ''
}

export function notifications(state = initialState, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        loading: true,
        error: ''
      }
    case GET_NOTIFICATIONS_SUCCESS:
      return {
        loading: false,
        notifications: action.notifications,
        error: ''
      }
    case GET_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}
