import { handleDowntimeInput, handleDescriptionInput, upload, uploadSuccess, uploadFailure } from './input.actions'
import { removeActiveLine } from '../Grid/grid.actions'
import { fetchSubmit } from '../api'

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

export function handleUpload(navigation, images, downtime, description, name, availableMin) {
  return (dispatch) => {
    var formData = new FormData();
    for (var i = 0; i < images.length; i++) {
      formData.append('image', {uri: images[i].uri, type: 'image/jpeg', name: "file"})
    }
    formData.append('lineLeaderName', name)
    formData.append('machineId', navigation.state.params.machineId);
    formData.append('downtime', downtime);
    formData.append('description', description);
    formData.append('availableMin', availableMin)

    dispatch(upload())
    return fetchSubmit(formData)
    .then(data => {
      if (data.message === 'success') {
        dispatch(uploadSuccess())
        dispatch(removeActiveLine())
        navigation.navigate('Grid')
      } else {
        dispatch(uploadFailure(err))
      }
    }).catch(err => {
      dispatch(uploadFailure(err))
    })
  }
}
