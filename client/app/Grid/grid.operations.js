import { getGrid, getGridSuccess, getGridFailure, getLines, getLinesSuccess, setLineIndex } from './grid.actions'
import { getRequest } from '../Storage'

export function fetchGrid(lineId) {
  return (dispatch) => {
    dispatch(getGrid)
    fetch(global.API_URL + '/api/grid/line/' + lineId, {credentials: 'include'})
    .then(res => res.json())
    .then(data => {
      dispatch(getGridSuccess(data))
    })
    .catch((error) => {
      dispatch(getGridFailure(error))
    })
  }
}

export function fetchLines() {
  return (dispatch) => {
    dispatch(getLines)
    getRequest(global.API_URL + '/api/account/lines').then(data => {
      var lines = []
      for (var i = 0; i < data.length; i++) {
        lines.push({name: 'LINE ' + data[i].name, lineId: data[i].lineId})
      }
      dispatch(getLinesSuccess(lines))
    })
    .catch(err => {
      console.log(err);
    })
  }
}

export function setLine(index) {
  return (dispatch) => {
    dispatch(setLineIndex(index))
  }
}
