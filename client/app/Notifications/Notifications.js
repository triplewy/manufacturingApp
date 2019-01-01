import React from 'react';
import { FlatList, View, RefreshControl, StyleSheet, Text, Image, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import { fetchNotifications } from './Notifications.operations'
import { readNotifications } from '../PushNotification/PushNotification.operations'

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this)
    this.parseNotificationTime = this.parseNotificationTime.bind(this)
  }

  componentDidMount() {
    this.props.getNotifications()
    this.props.setBadge(0)
  }

  parseNotificationTime(time) {
    if (time < 60) {
      return `${Math.round(time)} sec ago`
    } else if (time < 3600) {
      return `${Math.round(time / 60)} min ago`
    } else if (time < 86400) {
      return `${Math.round(time / 3600)} hour ago`
    } else {
      return `${Math.round(time / 86400)} day ago`
    }
  }

  renderItem(item) {
    return (
      <View style={styles.notification}>
        <Text style={styles.message}>{item.item.message}</Text>
        <Text style={styles.date}>{this.parseNotificationTime((new Date() - new Date(item.item.createdDate)) / 1000)}</Text>
      </View>
    )
  }

  render() {
    return (
      <FlatList
        data={this.props.notifications}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={this.props.getNotifications}
        refreshing={this.props.loading}
      />
    )
  }
}

const styles = StyleSheet.create({
  notification: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  message: {
    flex: 1
  },
  date: {

  }
})

function mapStateToProps(state) {
  return {
    ...state.notifications
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getNotifications: () => dispatch(fetchNotifications()),
    setBadge: (badge) => dispatch(readNotifications(badge))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
