export const GET_REPORTS = 'GET_REPORTS'
export const GET_REPORTS_SUCCESS = 'GET_REPORTS_SUCCESS'
export const GET_REPORTS_FAILURE = 'GET_REPORTS_FAILURE'

export const SET_REPORTS_LINE_INDEX = 'SET_REPORTS_LINE_INDEX'
export const SET_MACHINE_INDEX = 'SET_MACHINE_INDEX'

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

export function setLineIndex(index) {
  return{
    type: SET_REPORTS_LINE_INDEX,
    index: index
  }
}

export function setMachineIndex(index) {
  return{
    type: SET_MACHINE_INDEX,
    index: index
  }
}
