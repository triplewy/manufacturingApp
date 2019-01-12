import { getRequest, postRequest, formdataPostRequest } from './Storage'

export function fetchSignin(body) {
  return postRequest(`${global.API_GATEWAY_URL}/auth/signin`, body)
}

export function fetchSignup(body) {
  return postRequest(`${global.API_GATEWAY_URL}/auth/signup`, body)
}

export function fetchLogout() {
  return postRequest(`${global.API_GATEWAY_URL}/auth/logout`)
}

export function fetchSessionLogin() {
  return getRequest(`${global.API_GATEWAY_URL}/sessionlogin`)
}

export function fetchAccount() {
  return getRequest(`${global.API_GATEWAY_URL}/account`)
}

export function fetchDeviceToken(body) {
  return postRequest(`${global.API_GATEWAY_URL}/account/token`, body)
}

export function fetchNotifications() {
  return getRequest(`${global.API_GATEWAY_URL}/account/notifications`)
}

export function fetchReadNotifications() {
  return postRequest(`${global.API_GATEWAY_URL}/account/notifications/read`)
}

export function fetchSetActiveLine(lineId, machineId) {
  return postRequest(`${global.API_GATEWAY_URL}/input`, { lineId: lineId, machineId: machineId })
}

export function fetchDeleteActiveLine() {
  return postRequest(`${global.API_GATEWAY_URL}/input/delete`)
}

export function fetchSubmit(formdata) {
  return formdataPostRequest(`${global.AWS_URL}/input/submit`, formdata)
}

export function fetchSubmitWorkOrder(formdata) {
  return formdataPostRequest(`${global.API_GATEWAY_URL}/input/submit/workorder`, formdata)
}
  // submitWorkOrder(formdata) {
  //   return formdataPostRequest(`${global.AWS_URL}/input/submit/workorder`, formdata)
  // }

export function fetchReports(lineId, machineId, date, page) {
  if (machineId) {
    if (date) {
      return getRequest(`${global.API_GATEWAY_URL}/reports/machine/${machineId}/date/${date}/page/${page}`)
    } else {
      return getRequest(`${global.API_GATEWAY_URL}/reports/machine/${machineId}/page/${page}`)
    }
  } else {
    if (date) {
      return getRequest(`${global.API_GATEWAY_URL}/reports/line/${lineId}/date/${date}/page/${page}`)
    } else {
      return getRequest(`${global.API_GATEWAY_URL}/reports/line/${lineId}/page/${page}`)
    }
  }
}

export function fetchTotalDowntime(lineId, timePeriod) {
  return getRequest(`${global.API_GATEWAY_URL}/stats/totaldowntime/line/${lineId}/timePeriod/${timePeriod}`)
}

export function fetchStatsLine(lineId, timePeriod) {
  return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}`)
}

export function fetchStatsMachines(lineId, timePeriod, date) {
  if (date) {
    return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/machines/date/${date}`)
  } else {
    return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/machines`)
  }
}

export function fetchStatsWorkers(lineId, timePeriod, date) {
  if (date) {
    return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/workers/date/${date}`)
  } else {
    return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/workers`)
  }
}

export function fetchStatsShifts(lineId, timePeriod, date) {
  return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/shifts/date/${date}`)
}
