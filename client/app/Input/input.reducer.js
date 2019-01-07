import { HANDLE_DOWNTIME_INPUT, HANDLE_DESCRIPTION_INPUT, UPLOAD, UPLOAD_SUCCESS, UPLOAD_FAILURE } from './input.actions'

const initialState = {
  downtime: null,
  description: '',
  submitted: false,
  error: ''
}

export function input(state = initialState, action) {
  switch (action.type) {
    case HANDLE_DOWNTIME_INPUT:
      return {
        ...state,
        downtime: action.downtime
      }
    case HANDLE_DESCRIPTION_INPUT:
      return {
        ...state,
        description: action.description
      }
    case UPLOAD:
      return {
        ...state,
        submitted: true
      }
    case UPLOAD_SUCCESS:
      return {
        submitted: false,
        downtime: null,
        description: '',
        images: [],
        error: ''
      }
    case UPLOAD_FAILURE:
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}
