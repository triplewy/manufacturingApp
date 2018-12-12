export const SET_LOGIN_USERNAME = 'SET_LOGIN_USERNAME'
export const SET_LOGIN_PASSWORD = 'SET_LOGIN_PASSWORD'

export const GET_USER = 'GET_USER'
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS'
export const GET_USER_FAILURE = 'GET_USER_FAILURE'

export function getUser() {
  return {
    type: GET_USER
  }
}

export function getUserSuccess() {
  return {
    type: GET_USER_SUCCESS
  }
}

export function getUserFailure(error) {
  return {
    type: GET_USER_FAILURE,
    error: error,
  }
}

export function setUsername(username) {
  return{
    type: SET_LOGIN_USERNAME,
    username: username,
  }
}

export function setPassword(password) {
    return{
      type: SET_LOGIN_PASSWORD,
      password: password,
    }
}
