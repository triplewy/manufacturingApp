import { AsyncStorage } from 'react-native'
import CookieManager from 'react-native-cookies'

export function setCookie(cookie) {
  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem('cookie', cookie).then(() => {
      return resolve({message: 'success'})
    })
    .catch(err => {
      return reject(err)
    })
  })
}

export function getCookie() {
  return new Promise(function(resolve, reject) {
    AsyncStorage.getItem('cookie').then(value => {
      if (value !== null) {
        return resolve(value)
      } else {
        return resolve('')
      }
    })
    .catch(err => {
      return reject(err)
    })
  })
}

export function setName(name) {
  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem('name', name).then(() => {
      return resolve({message: 'success'})
    })
    .catch(err => {
      return reject(err);
    })
  })
}

export function getName() {
  return new Promise(function(resolve, reject) {
    AsyncStorage.getItem('name').then(value => {
      if (value !== null) {
        return resolve(value)
      } else {
        return resolve('')
      }
    })
    .catch(err => {
      return reject(err)
    })
  })
}

export function clearCookies() {
  return new Promise(function(resolve, reject) {
    CookieManager.clearAll()
    .then((res) => {
      console.log('CookieManager.clearAll =>', res);
      return resolve({message: 'success'})
    })
    .catch(err => {
      return reject(err)
    })
  })
}

export function getRequest(path) {
  return new Promise(function(resolve, reject) {
    getCookie().then(cookie => {
      const fetchParams = {
        method: 'GET',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "cookie": cookie,
        },
        credentials: "omit",
      }

      fetch(path, fetchParams)
      .then(res => {
        if (res.headers.get('set-cookie')) {
          setCookie(res.headers.get("set-cookie"))
        }
        return res.json()
      })
      .then(data => {
        return resolve(data)
      })
      .catch(err => {
        return reject(err)
      })
    })
  })
}

export function postRequest(path, body) {
  return new Promise(function(resolve, reject) {
    getCookie().then(cookie => {
      const fetchParams = {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "cookie": cookie,
        },
        body: JSON.stringify(body),
        credentials: "omit",
      }

      fetch(path, fetchParams)
      .then(res => {
        if (res.headers.get('set-cookie')) {
          setCookie(res.headers.get("set-cookie"))
        }
        return res.json()
      })
      .then(data => {
        return resolve(data)
      })
      .catch(err => {
        return reject(err)
      })
    })
  })
}




  // Clearing all cookies stored by native cookie managers.
  // return CookieManager.clearAll().then(() => {
  //   return fetch(path, fetchParams)
  //     .then(response => {
  //       storage.setCookie(response.headers.get("set-cookie"))
  //       return response
  //     })
  //     .then(data => data.json())
  // })
