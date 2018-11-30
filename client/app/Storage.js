import { AsyncStorage } from 'react-native'
import CookieManager from 'react-native-cookies'

export function setCookie(cookie) {
  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem('cookie', cookie).then(() => {
      CookieManager.set({
        name: 'connect.sid',
        value: cookie.substring(12),
        domain: 'ec2-18-217-232-204.us-east-2.compute.amazonaws.com',
        origin: 'ec2-18-217-232-204.us-east-2.compute.amazonaws.com',
        path: '/',
        version: '1',
        expiration: '2020-01-01T12:00:00.00-00:00'
      }).then((res) => {
        console.log("connect sid is", res);
        return resolve({message: 'success'})
      })
      .catch(err => {
        return reject(err)
      })
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
        CookieManager.set({
          name: 'connect.sid',
          value: value.substring(12),
          domain: '10.38.34.250',
          origin: '10.38.34.250',
          path: '/',
          version: '1',
          expiration: '2020-01-01T12:00:00.00-00:00'
        }).then((res) => {
          return resolve(value)
        })
        // CookieManager.getAll().then((res) => {
        //   console.log('CookieManager.getAll =>', res)
        //   return resolve(value)
        // })
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
