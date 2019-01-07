import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PushNotificationIOS, AppState } from 'react-native'
import { postToken, fetchBadge, applyBadge } from './PushNotification.operations'
import { getDeviceTokenRegistered } from '../Storage'

class PushNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      appState: AppState.currentState
    }

    this.handleAppStateChange = this.handleAppStateChange.bind(this)
    this.handleRegisterDevice = this.handleRegisterDevice.bind(this)
    this.handleRegistrationError = this.handleRegistrationError.bind(this)
    this.handleUpdateNotificationBadge = this.handleUpdateNotificationBadge.bind(this)
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    PushNotificationIOS.addEventListener('register', this.handleRegisterDevice)
    PushNotificationIOS.addEventListener('registrationError', this.handleRegistrationError)
    PushNotificationIOS.addEventListener('notification', this.handleUpdateNotificationBadge)

    PushNotificationIOS.getInitialNotification().then(notification => {
      if (!notification) {
        return
      }
      const data = notification.getData()
      this.props.setBadge(notification._badgeCount)
    })

    PushNotificationIOS.requestPermissions()
    this.props.getBadge()
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    PushNotificationIOS.removeEventListener('register', this.handleRegisterDevice)
    PushNotificationIOS.removeEventListener('registrationError', this.handleRegistrationError)
    PushNotificationIOS.removeEventListener('notification', this.handleUpdateNotificationBadge)
  }

  handleRegisterDevice = (token) => {
    postToken(token)
    // getDeviceTokenRegistered().then(value => {
    //   if (!value) {
    //     postToken(token)
    //   }
    // })
  }

  handleRegistrationError = (error) => {
    console.log(error, '--')
  }

  handleUpdateNotificationBadge = (notification) => {
    if (!notification) {
      return
    }
    console.log(notification);

    this.props.setBadge(notification._badgeCount)
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.props.getBadge().then(() => {
        this.props.setBadge(this.props.badge)
      })
      .catch(err => {
        console.log(err);
      })
    }
    this.setState({appState: nextAppState});
  }

  render() {
    return null
  }
}

function mapStateToProps(state) {
  return {
    ...state.pushNotification
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getBadge: () => dispatch(fetchBadge()),
    setBadge: (badge) => dispatch(applyBadge(badge))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PushNotification);
