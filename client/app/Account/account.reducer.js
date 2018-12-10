import {GET_ACCOUNT, GET_ACCOUNT_SUCCESS, GET_ACCOUNT_FAILURE,
        LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILURE,
        GET_NAME, GET_NAME_SUCCESS, GET_NAME_FAILURE,
        SET_NAME, SET_NAME_SUCCESS, SET_NAME_FAILURE
        } from './account.actions'

const initialState = {
  account: {},
  name: '',
  loading: false,
  fetched: false,
  error: "",
}

export function account(state = initialState, action) {
  switch (action.type) {
    case GET_ACCOUNT:
      return {
        ...state,
        loading: true
      }
    case GET_ACCOUNT_SUCCESS:
      return {
        ...state,
        account: action.account,
        fetched: true,
        loading: false,
      }
    case GET_ACCOUNT_FAILURE:
      return {
        ...state,
        fetched: true,
        loading: false,
        error: action.error
      }
    case LOGOUT:
      return {
        ...state
      }
    case LOGOUT_FAILURE:
      return {
        ...state,
        error: action.error
      }
    case GET_NAME:
      return {
        ...state
      }
    case GET_NAME_SUCCESS:
      return {
        ...state,
        name: action.name,
      }
    case GET_NAME_FAILURE:
      return {
        ...state,
        error: action.error
      }
    case SET_NAME:
      return {
        ...state
      }
    case SET_NAME_FAILURE:
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}
