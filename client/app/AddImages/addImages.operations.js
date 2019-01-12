import { addImage, deleteImage } from './addImages.actions'

export function insertImage(img) {
  return (dispatch) => {
    dispatch(addImage(img))
  }
}

export function removeImage(index) {
  return (dispatch) => {
    dispatch(deleteImage(index))
  }
}
