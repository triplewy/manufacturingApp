import { SET_SHIFTS } from './shifts.actions'

const initialState = {
  shifts: []
}

export function shifts(state = initialState, action) {
  switch (action.type) {
    case SET_SHIFTS:
      return {
        shifts: action.shifts,
      }
    default:
      return state
  }
}
