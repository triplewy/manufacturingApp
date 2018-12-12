import { SET_SIGNUP_USERNAME, SET_SIGNUP_PASSWORD, SET_CONFIRM_PASSWORD, SIGNUP, SIGNUP_FAILURE } from './createAccount.actions'

const initialState = {
  username: '',
  password: '',
  confirmPassword: '',
  submitted: false,
  error: '',
}

export function createAccount(state = initialState, action) {
  switch (action.type) {
    case SIGNUP:
      return {
        ...state,
        submitted: true,
      }
    case SIGNUP_FAILURE:
      return {
        ...state,
        submitted: false,
        error: action.error,
      }
    case SET_SIGNUP_USERNAME:
      return {
        ...state,
        username: action.username.replace(/\W+/g, '').toLowerCase(),
      }
    case SET_SIGNUP_PASSWORD:
      return {
        ...state,
        password: action.password,
      }
    case SET_CONFIRM_PASSWORD:
      return {
        ...state,
        confirmPassword: action.confirmPassword,
      }
    default:
      return state
  }
}
