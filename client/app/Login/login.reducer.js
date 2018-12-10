import { SET_USERNAME, SET_PASSWORD, GET_USER, GET_USER_FAILURE } from './login.actions'

const initialState = {
  username: "",
  password: "",
  fetchingUser: false,
  error: "",
}

export function login(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        fecthingUser: true,
      }
    case SET_USERNAME:
      return {
        data: action.data,
        dataFetched: true,
        isFetching: false,
        error: ""
      }

    case GET_GRID_FAILURE:
      return {
        data: [],
        dataFetched: true,
        isFetching: false,
        error: action.error
      }
    case GET_LINE:
      return {
        ...state,
        isFetching: true
      }
    case GET_LINE_SUCCESS:
      return {
        ...state,
        lines: action.lines,
        dataFetched: true,
        isFetching: false,
        error: ""
      }
    case SET_LINE_INDEX:
      return {
        ...state,
        lineIndex: action.index,
      }
    default:
      return state
  }
}
