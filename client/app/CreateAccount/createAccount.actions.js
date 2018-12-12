export const SET_SIGNUP_USERNAME = 'SET_USERNAME'
export const SET_SIGNUP_PASSWORD = 'SET_PASSWORD'
export const SET_CONFIRM_PASSWORD = 'SET_CONFIRM_PASSWORD'

export const SIGNUP = 'SIGNUP'
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE'

export function signup() {
  return {
    type: SIGNUP
  }
}

export function signupFailure(error) {
    return {
      type: SIGNUP_FAILURE,
      error: error,
    }
  }

export function setUsername(username) {
  return {
    type: SET_SIGNUP_USERNAME,
    username: username,
  }
}

export function setPassword(password) {
  return {
    type: SET_SIGNUP_PASSWORD,
    password: password,
  }
}
export function setConfirmPassword(password) {
  return {
    type: SET_CONFIRM_PASSWORD,
    confirmPassword: password
  }
}
