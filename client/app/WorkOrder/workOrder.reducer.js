import {
  SET_WORKORDER_LINE_INDEX,
  SET_WORKORDER_MACHINE_INDEX,
  SET_WORKORDER_DESCRIPTION,
  SET_RATING,
  WORKORDER,
  WORKORDER_SUCCESS,
  WORKORDER_FAILURE
} from './workOrder.actions'

const initialState = {
  lineIndex: 0,
  machineIndex: 0,
  description: '',
  rating: 3,
  error: '',
  submitted: false
}

export function workOrder(state = initialState, action) {
  switch (action.type) {
    case SET_WORKORDER_LINE_INDEX:
      return {
        ...state,
        lineIndex: action.index,
      }
    case SET_WORKORDER_MACHINE_INDEX:
      return {
        ...state,
        machineIndex: action.index
      }
    case SET_WORKORDER_DESCRIPTION:
      return {
        ...state,
        description: action.description
      }
    case SET_RATING: {
      return {
        ...state,
        rating: action.rating
      }
    }
    case WORKORDER: {
      return {
        ...state,
        submitted: true,
        error: ''
      }
    }
    case WORKORDER_SUCCESS: {
      return {
        lineIndex: 0,
        machineIndex: 0,
        description: '',
        rating: 3,
        error: '',
        submitted: false
      }
    }
    case WORKORDER_FAILURE: {
      return {
        ...state,
        submitted: false,
        error: action.err
      }
    }
    default:
      return state
  }
}
