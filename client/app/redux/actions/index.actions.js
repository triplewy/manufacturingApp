export function loggedIn(bool) {
  return {
    type: 'LOGGED_IN',
    loggedIn: bool
  }
}

export const resolvedGetData(data) {
  return {
    type: 'RESOLVED_GET_DATA',
    data
  }
}

export function getGrid() {
  (dispatch) => {
    return fetch('/api/grid')
  }
}
