import { SESSION_LOGIN, SESSION_LOGIN_SUCCESS, SESSION_LOGIN_FAILURE } from './splash.actions'

const initialState = {
  loading: false,
  fetched: false,
  success: false,
  lines: []
}

export function splash(state = initialState, action) {
  switch (action.type) {
    case SESSION_LOGIN:
      return {
        ...state,
        loading: true
      }
    case SESSION_LOGIN_SUCCESS:
      return {
        loading: false,
        fetched: true,
        success: true,
        lines: action.lines
      }

    case SESSION_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        fetched: true,
        success: false
      }
    default:
      return state
  }
}