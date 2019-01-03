import { getRequest, postRequest, formdataPostRequest } from './Storage'


export default class API {


  signIn(body) {
    return postRequest(`${global.API_GATEWAY_URL}/auth/signin`, body)
  }

  signUp(body) {
    return postRequest(`${global.API_GATEWAY_URL}/auth/signup`, body)
  }

  logout() {
    return postRequest(`${global.API_GATEWAY_URL}/auth/logout`)
  }

  sessionLogin() {
    return getRequest(`${global.API_GATEWAY_URL}/sessionlogin`)
  }

  account() {
    return getRequest(`${global.API_GATEWAY_URL}/account`)
  }

  deviceToken(body) {
    return postRequest(`${global.API_GATEWAY_URL}/account/token`, body)
  }

  notifications() {
    return getRequest(`${global.API_GATEWAY_URL}/account/notifications`)
  }

  readNotifications() {
    return postRequest(`${global.API_GATEWAY_URL}/account/notifications/read`)
  }

  submit(formdata) {
    return formdataPostRequest(`${global.API_GATEWAY_URL}/input/submit`, formdata)
  }

  reports(lineId, machineId, date, page) {
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

  totalDowntime(lineId, timePeriod) {
    return getRequest(`${global.API_GATEWAY_URL}/stats/totaldowntime/line/${lineId}/timePeriod/${timePeriod}`)
  }

  statsLine(lineId, timePeriod) {
    return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}`)
  }

  statsMachines(lineId, timePeriod, date) {
    if (date) {
      return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/machines/date/${date}`)
    } else {
      return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/machines`)
    }
  }

  statsWorkers(lineId, timePeriod, date) {
    if (date) {
      return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/workers/date/${date}`)
    } else {
      return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/workers`)
    }
  }

  statsShifts(lineId, timePeriod, date) {
    return getRequest(`${global.API_GATEWAY_URL}/stats/downtime/line/${lineId}/timePeriod/${timePeriod}/shifts/date/${date}`)
  }

}
