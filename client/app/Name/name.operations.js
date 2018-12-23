import { setNameIndex } from './name.actions'

export function setName(index) {
  return (dispatch) => {
    console.log(index);
    dispatch(setNameIndex(index))
  }
}
