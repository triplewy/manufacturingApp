export const GET_ACCOUNT = 'GET_ACCOUNT'
export const GET_ACCOUNT_SUCCESS = 'GET_ACCOUNT_SUCCESS'
export const GET_ACCOUNT_FAILURE = 'GET_ACCOUNT_FAILURE'

export const LOGOUT = 'LOGOUT'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

export const SET_NAME = 'SET_NAME'
export const SET_NAME_FAILURE = 'SET_NAME_FAILURE'

export const GET_NAME = 'GET_NAME'
export const GET_NAME_SUCCESS = 'GET_NAME_SUCCESS'
export const GET_NAME_FAILURE = 'GET_NAME_FAILURE'

export function getAccount() {
  return {
    type: GET_ACCOUNT
  }
}

export function getAccountSuccess(data) {
  return {
    type: GET_ACCOUNT_SUCCESS,
    account: data
  }
}

export function getAccountFailure(error) {
  return {
    type: GET_ACCOUNT_SUCCESS,
    error: error
  }
}

export function logout() {
  return {
    type: LOGOUT
  }
}

export function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    error: error
  }
}

export function getStoredName() {
  return {
    type: GET_NAME
  }
}

export function getStoredNameSuccess(data) {
  return {
    type: GET_NAME_SUCCESS,
    name: data
  }
}

export function getStoredNameFailure(error) {
  return {
    type: GET_NAME_SUCCESS,
    error: error
  }
}

export function setStoredName() {
  return {
    type: SET_NAME
  }
}

export function setStoredNameFailure(error) {
  return {
    type: SET_NAME_FAILURE,
    error: error
  }
}
