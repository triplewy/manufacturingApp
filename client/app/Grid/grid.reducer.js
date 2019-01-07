import {
  GET_GRID,
  GET_GRID_SUCCESS,
  GET_GRID_FAILURE,
  SET_GRID_LINE_INDEX,
  ADD_ACTIVE_LINE,
  REMOVE_ACTIVE_LINE,
  CHANGE_ACTIVE_MACHINE,
  SET_EXPIRE
} from './grid.actions'

const initialState = {
  activeLine: null,
  activeMachine: null,
  expire: null,
  data: [],
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
    case SET_GRID_LINE_INDEX:
      return {
        ...state,
        lineIndex: action.index,
      }
    case ADD_ACTIVE_LINE: {
      return {
        ...state,
        activeLine: action.lineId,
        activeMachine: action.machineId,
        expire: action.expireDate,
        submitted: false
      }
    }
    case REMOVE_ACTIVE_LINE: {
      return {
        ...state,
        activeLine: null,
        activeMachine: null,
        expire: null,
      }
    }
    case CHANGE_ACTIVE_MACHINE: {
      return {
        ...state,
        activeMachine: action.machineId
      }
    }
    case SET_EXPIRE: {
      return {
        ...state,
        expire: action.expire
      }
    }
    default:
      return state
  }
}
