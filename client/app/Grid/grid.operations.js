import { getGrid, getGridSuccess, getGridFailure, setLineIndex } from './grid.actions'
import { getRequest } from '../Storage'

// export function fetchGrid(lineId) {
//   return (dispatch) => {
//     dispatch(getGrid)
//     getRequest(global.API_URL + '/api/grid/line/' + lineId)
//     .then(data => {
//       dispatch(getGridSuccess(data))
//     })
//     .catch((error) => {
//       dispatch(getGridFailure(error))
//     })
//   }
// }

export function setLine(index) {
  return (dispatch) => {
    dispatch(setLineIndex(index))
    return Promise.resolve()
  }
}
