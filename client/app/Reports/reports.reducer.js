import {
  GET_REPORTS, GET_REPORTS_SUCCESS, GET_REPORTS_FAILURE,
  UPDATE_REPORTS, UPDATE_REPORTS_SUCCESS, UPDATE_REPORTS_FAILURE, UPDATE_PAGE, UPDATE_DATE,
  SET_REPORTS_LINE_INDEX, SET_REPORTS_MACHINE_INDEX, SET_REPORTS_NAME_INDEX
} from './reports.actions'

const initialState = {
  reports: [],
  lineIndex: 0,
  machineIndex: 0,
  nameIndex: 0,
  page: 0,
  date: '',
  refreshing: false,
  updating: false,
  finished: false,
  error: ""
}

export function reports(state = initialState, action) {
  switch (action.type) {
    case GET_REPORTS:
      return {
        ...state,
        refreshing: true,
        page: 0
      }
    case GET_REPORTS_SUCCESS:
      return {
        ...state,
        reports: action.reports,
        refreshing: false,
        finished: action.reports.length < 10,
        error: ""
      }

    case GET_REPORTS_FAILURE:
      return {
        ...state,
        refreshing: false,
        error: action.error
      }
    case UPDATE_REPORTS:
      return {
        ...state,
        updating: true
      }
    case UPDATE_REPORTS_SUCCESS:
      return {
        ...state,
        reports: state.reports.concat(action.reports),
        updating: false,
        finished: action.reports.length < 10,
        error: ""
      }
    case UPDATE_REPORTS_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.error
      }
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page,
        updating: true
      }
    case UPDATE_DATE:
      return {
        ...state,
        date: action.date
      }
    case SET_REPORTS_LINE_INDEX:
      return {
        ...state,
        lineIndex: action.index,
        machineIndex: 0
      }
    case SET_REPORTS_MACHINE_INDEX:
      return {
        ...state,
        machineIndex: action.index,
      }
    case SET_REPORTS_NAME_INDEX:
      return {
        ...state,
        nameIndex: action.index,
      }
    default:
      return state
  }
}
