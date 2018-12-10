import { GET_GRID, GET_GRID_SUCCESS, GET_GRID_FAILURE, GET_LINE, GET_LINE_SUCCESS, SET_LINE_INDEX } from './grid.actions'

const initialState = {
  data: [],
  lines: [],
  lineIndex: 0,
  dataFetched: false,
  isFetching: false,
  error: ""
}

export function grid(state = initialState, action) {
  switch (action.type) {
    case GET_GRID:
      return {
        ...state,
        isFetching: true
      }
    case GET_GRID_SUCCESS:
      return {
        ...state,
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
