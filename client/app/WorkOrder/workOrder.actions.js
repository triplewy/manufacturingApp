export const SET_WORKORDER_LINE_INDEX = 'SET_WORK_ORDER_LINE_INDEX'
export const SET_WORKORDER_MACHINE_INDEX = 'SET_WORKORDER_MACHINE_INDEX'
export const SET_WORKORDER_DESCRIPTION = 'SET_WORKORDER_DESCRIPTION'
export const SET_RATING = 'SET_RATING'
export const WORKORDER = 'WORKORDER'
export const WORKORDER_SUCCESS = 'WORKORDER_SUCCESS'
export const WORKORDER_FAILURE = 'WORKORDER_FAILURE'

export function setLineIndex(index) {
  return {
    type: SET_WORKORDER_LINE_INDEX,
    index: index
  }
}

export function setMachineIndex(index) {
  return{
    type: SET_WORKORDER_MACHINE_INDEX,
    index: index
  }
}

export function setDescription(description) {
  return{
    type: SET_WORKORDER_DESCRIPTION,
    description: description
  }
}

export function setRating(rating) {
  return {
    type: SET_RATING,
    rating: rating
  }
}

export function workOrder() {
  return {
    type: WORKORDER
  }
}

export function workOrderSuccess() {
  return {
    type: WORKORDER_SUCCESS
  }
}

export function workOrderFailure(err) {
  return {
    type: WORKORDER_FAILURE,
    err: err
  }
}
