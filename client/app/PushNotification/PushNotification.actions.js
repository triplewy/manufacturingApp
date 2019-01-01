export const GET_BADGE = 'GET_BADGE'
export const SET_BADGE = 'SET_BADGE'

export function getBadge(badge) {
  return {
    type: GET_BADGE,
    badge: badge
  }
}

export function setBadge(badge) {
  return {
    type: SET_BADGE,
    badge: badge
  }
}
