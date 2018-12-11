export const HANDLE_DOWNTIME_INPUT = 'HANDLE_DOWNTIME_INPUT'
export const HANDLE_DESCRIPTION_INPUT = 'HANDLE_DESCRIPTION_INPUT'
export const UPLOAD = 'UPLOAD'
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS'
export const UPLOAD_FAILURE = 'UPLOAD_FAILURE'
export const ADD_IMAGE = 'ADD_IMAGE'
export const DELETE_IMAGE = 'DELETE_IMAGE'

export function handleDowntimeInput(text) {
  return {
    type: HANDLE_DOWNTIME_INPUT,
    downtime: text
  }
}

export function handleDescriptionInput(text) {
  return {
    type: HANDLE_DESCRIPTION_INPUT,
    description: text
  }
}

export function upload(error) {
  return{
    type: UPLOAD
  }
}

export function uploadSuccess() {
  return {
    type: UPLOAD_SUCCESS
  }
}

export function uploadFailure(error) {
  return {
    type: UPLOAD_FAILURE,
    error: error
  }
}

export function addImage(image) {
  return {
    type: ADD_IMAGE,
    image: image
  }
}

export function deleteImage(index) {
  return {
    type: DELETE_IMAGE,
    index: index
  }
}
