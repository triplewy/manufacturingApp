export const SET_USERNAME = 'SET_USERNAME'
export const SET_PASSWORD = 'SET_PASSWORD'
export const GET_USER = 'GET_USER'
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS'
export const GET_USER_FAILURE = 'GET_USER_FAILURE'

export const SET_NAME = 'SET_NAME'
export const SET_NAME_FAILURE = 'SET_NAME_FAILURE'

export function getUser() {
  return {
    type: GET_USER
  }
}

export function getUserSuccess() {
    return {
        type: GET_USER_SUCCESS,
        fetchingUser: false,
        error: "",
        loginSuccess:true,
    }
}

export function getUserFailure(error) {
    return {
      type: GET_USER_FAILURE,
      fetchingUser: false,
      error: error,
      loginSuccess: false,
    }
  }

export function setUsername(username) {
  return{
    type: SET_USERNAME,
    username: username,
  }
}

export function setPassword(password) {
    return{
      type: SET_PASSWORD,
      password: password,
    }
}

