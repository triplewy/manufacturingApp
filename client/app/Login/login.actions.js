export const SET_USERNAME = 'SET_USERNAME'
export const SET_PASSWORD = 'SET_PASSWORD'
export const GET_USER = 'GET_USER'
export const GET_USER_FAILURE = 'GET_USER_FAILURE'

export const SET_NAME = 'SET_NAME'
export const SET_NAME_FAILURE = 'SET_NAME_FAILURE'

export function getUser() {
  return {
    type: GET_USER
  }
}

export function getUserFailure(error) {
    return {
      type: GET_USER_FAILURE,
      error: error
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



export function getLinesSuccess(lines) {
  return{
    type: GET_LINE_SUCCESS,
    lines: lines
  }
}

export function getLinesFailure(error) {
  return{
    type: GET_LINE_SUCCESS,
    error: error
  }
}

export function setLineIndex(index) {
  return{
    type: SET_LINE_INDEX,
    index: index
  }
}
