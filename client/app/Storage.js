import { AsyncStorage } from 'react-native'
import CookieManager from 'react-native-cookies'

export function setCookie(cookie) {
  return new Promise(function(resolve, reject) {
    clearCookies().then(() => {
      AsyncStorage.setItem('cookie', cookie).then(() => {
        console.log("cookie stored");
        return resolve({message: 'success'})
      })
      .catch(err => {
        return reject(err)
      })
    })
  })
}

export function getCookie() {
  return new Promise(function(resolve, reject) {
    clearCookies().then(() => {
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
  })
}

export function setNameStorage(index) {
  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem('name', index).then(() => {
      return resolve({message: 'success'})
    })
    .catch(err => {
      return reject(err);
    })
  })
}

export function getNameStorage() {
  return new Promise(function(resolve, reject) {
    AsyncStorage.getItem('name').then(value => {
      if (value !== null) {
        return resolve(parseInt(value, 10))
      } else {
        return resolve(-1)
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
      console.log('cookie is', cookie);
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
        // if (res.headers.get('set-cookie')) {
        //   setCookie(res.headers.get("set-cookie"))
        // }
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
        console.log(res);
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

export function formdataPostRequest(path, formdata) {
  return new Promise(function(resolve, reject) {
    getCookie().then(cookie => {
      const fetchParams = {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data",
          "cookie": cookie,
        },
        body: formdata,
        credentials: "omit",
      }

      fetch(path, fetchParams)
      .then(res => {
        console.log(res);
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
