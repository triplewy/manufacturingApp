import { GET_BADGE, SET_BADGE } from './PushNotification.actions'

const initialState = {
  badge: 0
}

export function pushNotification(state = initialState, action) {
  switch (action.type) {
    case GET_BADGE:
      return {
        badge: action.badge
      }
    case SET_BADGE:
      return {
        badge: action.badge
      }
    default:
      return state
  }
}
