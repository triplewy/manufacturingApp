import {
  getReports, getReportsSuccess, getReportsFailure,
  updateReports, updateReportsSuccess, updateReportsFailure, updatePage, updateDate,
  setLineIndex, setMachineIndex, setNameIndex
} from './reports.actions'
import API from '../api'

const api = new API()

export function fetchReports(lineId, machineId, date) {
  return (dispatch) => {
    dispatch(getReports)
    //
    // var url = global.API_URL
    // if (machineId) {
    //   url += '/api/reports/machine=' + machineId
    // } else {
    //   url += '/api/reports/line=' + lineId
    // }
    //
    // if (date) {
    //   url += '/date=' + date
    // }
    //
    // url += '/page=0'

    return api.reports(lineId, machineId, date, 0)
    .then(data => {
      dispatch(getReportsSuccess(data))
    })
    .catch(err => {
      dispatch(getReportsFailure(err))
    })
  }
}

export function fetchUpdateReports(lineId, machineId, date, page) {
  return (dispatch) => {
    dispatch(updateReports)

    // var url = global.API_URL
    // if (machineId) {
    //   url += '/api/reports/machine=' + machineId
    // } else {
    //   url += '/api/reports/line=' + lineId
    // }
    //
    // if (date) {
    //   url += '/date=' + date
    // }
    //
    // url += '/page=' + page

    return api.reports(lineId, machineId, date, page)
    .then(data => {
      dispatch(updateReportsSuccess(data))
    })
    .catch(err => {
      dispatch(updateReportsFailure(err))
    })

  }
}

export function setPage(page) {
  return (dispatch) => {
    dispatch(updatePage(page))
    return Promise.resolve()
  }
}

export function setDate(date) {
  return (dispatch) => {
    dispatch(updateDate(date))
    return Promise.resolve()
  }
}

export function setLine(index) {
  return (dispatch) => {
    dispatch(setLineIndex(index))
    return Promise.resolve()
  }
}

export function setMachine(index) {
  return (dispatch) => {
    dispatch(setMachineIndex(index))
    return Promise.resolve()
  }
}

export function setName(index) {
  return (dispatch) => {
    dispatch(setNameIndex(index))
    return Promise.resolve()
  }
}
