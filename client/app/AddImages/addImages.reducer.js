import { ADD_IMAGE, DELETE_IMAGE } from './addImages.actions'

const initialState = {
  images: []
}

export function addImages(state = initialState, action) {
  switch (action.type) {
    case ADD_IMAGE:
      return {
        images: state.images.concat(action.img)
      }
    case DELETE_IMAGE:
      return {
        images: [...state.images.slice(0, action.index), ...state.images.slice(action.index + 1)]
      }
    default:
      return state
  }
}
