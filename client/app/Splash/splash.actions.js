export const SESSION_LOGIN = 'SESSION_LOGIN'
export const SESSION_LOGIN_SUCCESS = 'SESSION_LOGIN_SUCCESS'
export const SESSION_LOGIN_FAILURE = 'SESSION_LOGIN_FAILURE'

export function sessionLogin() {
  return {
    type: SESSION_LOGIN
  }
}

export function sessionLoginSuccess(lines, machines, names) {
  return {
    type: SESSION_LOGIN_SUCCESS,
    lines: lines,
    machines: machines,
    names: names
  }
}

export function sessionLoginFailure(error) {
  return{
    type: SESSION_LOGIN_FAILURE,
    error: error
  }
}
