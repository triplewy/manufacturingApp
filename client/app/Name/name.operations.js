import { setNameIndex } from './name.actions'

export function setName(index) {
  return (dispatch) => {
    dispatch(setNameIndex(index))
  }
}
