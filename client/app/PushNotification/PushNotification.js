import React, { Component } from 'react'
import { PushNotificationIOS, Alert } from 'react-native'
import { postToken } from './pushNotification.operations'
import { getDeviceTokenRegistered } from '../Storage'

class PushNotification extends Component {
  componentDidMount() {
    PushNotificationIOS.addEventListener('register', token => {
      getDeviceTokenRegistered().then(value => {
        if (!value) {
          postToken(token)
        } else {
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
      })
    })

    PushNotificationIOS.addEventListener('registrationError', registrationError => {
      console.log(registrationError, '--')
    })

    PushNotificationIOS.addEventListener('notification', function(notification) {
      if (!notification) {
        return
      }
      //This calls when user opens the app after getting notification
      const data = notification.getData()
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
      Alert.alert(JSON.stringify({ data, source: 'CollapsedApp' }))
    })

    PushNotificationIOS.getInitialNotification().then(notification => {
      if (!notification) {
        return
      }
      const data = notification.getData()
      Alert.alert(JSON.stringify({ data, source: 'ClosedApp' }))
    })
    PushNotificationIOS.requestPermissions()
  }

  render() {
    return null
  }
}

export default PushNotification
