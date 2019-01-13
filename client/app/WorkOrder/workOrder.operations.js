import { setLineIndex, setMachineIndex, setDescription, setRating, workOrder, workOrderSuccess, workOrderFailure } from './workOrder.actions'
import { resetImages } from '../AddImages/addImages.actions'
import { fetchSubmitWorkOrder } from '../api'

export function lineIndex(index) {
  return (dispatch) => {
    dispatch(setLineIndex(index))
  }
}

export function machineIndex(index) {
  return (dispatch) => {
    dispatch(setMachineIndex(index))
  }
}

export function handleDescription(description) {
  return (dispatch) => {
    dispatch(setDescription(description))
  }
}

export function handleRating(rating) {
  return (dispatch) => {
    dispatch(setRating(rating))
  }
}

export function submit(lineId, machineId, rating, description, images) {
  return (dispatch) => {
    return new Promise(function(resolve, reject) {
      dispatch(workOrder())

      var formData = new FormData();
      for (var i = 0; i < images.length; i++) {
        formData.append('image', {uri: images[i].uri, type: 'image/jpeg', name: "file"})
      }
      formData.append('lineId', lineId)
      formData.append('machineId', machineId);
      formData.append('rating', rating)
      formData.append('description', description);

      fetchSubmitWorkOrder(formData).then(data => {
        if (data.message === 'success') {
          dispatch(workOrderSuccess())
          dispatch(resetImages())
          return resolve()
        } else {
          dispatch(workOrderFailure('Failed to submit'))
          return reject()
        }
      }).catch(err => {
        dispatch(workOrderFailure(err))
        return reject()
      })
    })
  }
}
