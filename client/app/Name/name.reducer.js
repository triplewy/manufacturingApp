import { SET_NAME_INDEX } from './name.actions'

const initialState = {
  nameIndex: -1,
  error: '',
}

export function name(state = initialState, action) {
  switch (action.type) {
    case SET_NAME_INDEX:
      return {
        nameIndex: action.index,
        error: ''
      }
    default:
      return state
  }
}
