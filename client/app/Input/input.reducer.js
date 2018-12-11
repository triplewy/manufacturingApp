import { HANDLE_DOWNTIME_INPUT, HANDLE_DESCRIPTION_INPUT, UPLOAD, UPLOAD_SUCCESS, UPLOAD_FAILURE, ADD_IMAGE, DELETE_IMAGE } from './input.actions'

const initialState = {
  downtime: '',
  description: '',
  images: [],
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
        downtime: '',
        description: '',
        images: [],
        error: ''
      }
    case UPLOAD_FAILURE:
      return {
        ...state,
        error: action.error
      }
    case ADD_IMAGE:
      return {
        ...state,
        images: state.images.concat(action.image)
      }
    case DELETE_IMAGE: {
      var temp = state.images
      temp.splice(action.index, 1)
      return {
        ...state,
        images: temp
      }
    }
    default:
      return state
  }
}
