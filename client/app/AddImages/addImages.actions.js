export const ADD_IMAGE = 'ADD_IMAGE'
export const DELETE_IMAGE = 'DELETE_IMAGE'
export const RESET_IMAGES = 'RESET_IMAGES'

export function addImage(img) {
  return {
    type: ADD_IMAGE,
    img: img
  }
}

export function deleteImage(index) {
  return {
    type: DELETE_IMAGE,
    index: index
  }
}

export function resetImages() {
  return {
    type: RESET_IMAGES
  }
}
