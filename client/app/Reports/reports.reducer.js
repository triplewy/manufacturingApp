import { GET_REPORTS, GET_REPORTS_SUCCESS, GET_REPORTS_FAILURE, SET_REPORTS_LINE_INDEX, SET_MACHINE_INDEX } from './reports.actions'

const initialState = {
  reports: [],
  machines: [],
  lineIndex: 0,
  machineIndex: 0,
  dataFetched: false,
  isFetching: false,
  error: ""
}

export function reports(state = initialState, action) {
  switch (action.type) {
    case GET_REPORTS:
      return {
        ...state,
        isFetching: true
      }
    case GET_REPORTS_SUCCESS:
      return {
        ...state,
        data: action.data,
        dataFetched: true,
        isFetching: false,
        error: ""
      }

    case GET_REPORTS_FAILURE:
      return {
        data: [],
        dataFetched: true,
        isFetching: false,
        error: action.error
      }
    case SET_REPORTS_LINE_INDEX:
      return {
        ...state,
        lineIndex: action.index,
      }
    case SET_MACHINE_INDEX:
      return {
        ...state,
        lineIndex: action.index,
      }
    default:
      return state
  }
}
