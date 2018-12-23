import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { fetchSessionLogin } from './splash.operations'
import { connect } from 'react-redux'
import { getNameStorage } from '../Storage'

class Splash extends React.Component {

  componentDidMount() {
    this.props.sessionLogin().then(() => {
      if (this.props.success) {
        console.log('nameIndex', this.props.nameIndex);
        if (this.props.nameIndex < 0) {
          this.props.navigation.navigate('Name')
        } else {
          this.props.navigation.navigate('Tabs')
        }
      } else {
        this.props.navigation.navigate('Auth')
      }
    })
  }

  render() {
    return (
      <View style={styles.splashBackground}>
        <Text style={styles.splashTitle}>Streamline</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  splashBackground: {
    backgroundColor: '#FF8300',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  splashTitle: {
    textAlign: 'center',
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white'
  }
})

function mapStateToProps(state) {
  return {
    success: state.splash.success,
    nameIndex: state.name.nameIndex
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sessionLogin: () => dispatch(fetchSessionLogin()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
