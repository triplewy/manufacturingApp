export const ADD_IMAGE = 'ADD_IMAGE'
export const DELETE_IMAGE = 'DELETE_IMAGE'

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
