import React from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { connect } from 'react-redux'

class NotificationBadge extends React.Component {

  render() {
    if (this.props.badge) {
      return (
        <View style={styles.badgeWrapper}>
          <Text style={styles.badge}>{this.props.badge}</Text>
        </View>
      )
    } else {
      return null
    }

  }
}

const styles = StyleSheet.create({
  badgeWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    overflow: 'hidden',
  },
  badge: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  }
})

function mapStateToProps(state) {
  return {
    ...state.pushNotification
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationBadge);
