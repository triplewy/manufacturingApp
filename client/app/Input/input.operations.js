import { handleDowntimeInput, handleDescriptionInput, upload, uploadSuccess, uploadFailure, addImage, deleteImage } from './input.actions'
import { getRequest, formdataPostRequest } from '../Storage'

export function handleDowntime(text) {
  return (dispatch) => {
    dispatch(handleDowntimeInput(text.replace(/[^0-9]/g, '')))
  }
}

export function handleDescription(text) {
  return (dispatch) => {
    dispatch(handleDescriptionInput(text))
  }
}

export function handleAddImage(image) {
  return (dispatch) => {
    dispatch(addImage(image))
  }
}

export function handleDeleteImage(index) {
  return (dispatch) => {
    dispatch(deleteImage(index))
  }
}

export function handleUpload(navigation, images, downtime, description, name) {
  return (dispatch) => {
    var formData = new FormData();
    for (var i = 0; i < images.length; i++) {
      formData.append('image', {uri: images[i].uri, name: "file"})
    }
    formData.append('lineLeaderName', name)
    formData.append('machineId', navigation.state.params.machineId);
    formData.append('downtime', downtime);
    formData.append('description', description);

    dispatch(upload())

    return formdataPostRequest(global.API_URL + '/api/input/submit', formData)
    .then(data => {
      if (data.message === 'success') {
        dispatch(uploadSuccess())
        navigation.navigate('Grid')
      } else {
        dispatch(uploadFailure(err))
      }
    }).catch(err => {
      dispatch(uploadFailure(err))
    })
  }
}
