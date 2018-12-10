import { SET_USERNAME, SET_PASSWORD, GET_USER, GET_USER_FAILURE, GET_USER_SUCCESS } from './login.actions'

const initialState = {
  username: "",
  password: "",
  fetchingUser: false,
  error: "",
  loginSuccess: false,
}

export function login(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        fecthingUser: true,
      }
    case GET_USER_SUCCESS:
      return {
        ...state,
        fetchIngUser: false,
        error: "",
        loginSuccess: true,
      }
    case GET_USER_FAILURE:
      return {
        ...state,
        fetchIngUser: false,
        error: action.error,
        loginSuccess: false,
      }
    case SET_USERNAME:
      return {
        ...state,
        username: action.username,
      }

    case SET_PASSWORD:
      return {
        ...state,
        password: action.password,
      }
    default:
      return state
  }
}
