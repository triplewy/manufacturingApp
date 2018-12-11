export const GET_REPORTS = 'GET_REPORTS'
export const GET_REPORTS_SUCCESS = 'GET_REPORTS_SUCCESS'
export const GET_REPORTS_FAILURE = 'GET_REPORTS_FAILURE'

export const UPDATE_REPORTS = 'UPDATE_REPORTS'
export const UPDATE_REPORTS_SUCCESS = 'UPDATE_REPORTS_SUCCESS'
export const UPDATE_REPORTS_FAILURE = 'UPDATE_REPORTS_FAILURE'
export const UPDATE_PAGE = 'UPDATE_PAGE'
export const UPDATE_DATE = 'UPDATE_DATE'

export const SET_REPORTS_LINE_INDEX = 'SET_REPORTS_LINE_INDEX'
export const SET_REPORTS_MACHINE_INDEX = 'SET_REPORTS_MACHINE_INDEX'

export function getReports() {
  return {
    type: GET_REPORTS
  }
}

export function getReportsSuccess(reports) {
  return{
    type: GET_REPORTS_SUCCESS,
    reports: reports
  }
}

export function getReportsFailure(error) {
  return{
    type: GET_REPORTS_FAILURE,
    error: error
  }
}

export function updateReports() {
  return {
    type: UPDATE_REPORTS
  }
}

export function updateReportsSuccess(reports) {
  return{
    type: UPDATE_REPORTS_SUCCESS,
    reports: reports
  }
}

export function updateReportsFailure(error) {
  return{
    type: UPDATE_REPORTS_FAILURE,
    error: error
  }
}

export function updatePage(page) {
  return {
    type: UPDATE_PAGE,
    page: page
  }
}

export function updateDate(date) {
  return {
    type: UPDATE_DATE,
    date: date
  }
}

export function setLineIndex(index) {
  return{
    type: SET_REPORTS_LINE_INDEX,
    index: index
  }
}

export function setMachineIndex(index) {
  return{
    type: SET_REPORTS_MACHINE_INDEX,
    index: index
  }
}
