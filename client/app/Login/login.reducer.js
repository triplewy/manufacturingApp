import { SET_LOGIN_USERNAME, SET_LOGIN_PASSWORD, GET_USER, GET_USER_SUCCESS, GET_USER_FAILURE } from './login.actions'

const initialState = {
  username: '',
  password: '',
  submitted: false,
  error: '',
}

export function login(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        submitted: true,
        error: ''
      }
    case GET_USER_SUCCESS:
      return {
        username: '',
        password: '',
        submitted: false,
        error: '',
      }
    case GET_USER_FAILURE:
      return {
        ...state,
        submitted: false,
        error: action.error,
      }
    case SET_LOGIN_USERNAME:
      return {
        ...state,
        username: action.username,
      }

    case SET_LOGIN_PASSWORD:
      return {
        ...state,
        password: action.password,
      }
    default:
      return state
  }
}
