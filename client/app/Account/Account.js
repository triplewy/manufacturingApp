import React from 'react';
import { ScrollView, View, RefreshControl, StyleSheet, Text, Image, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { handleAccount, handleLogout, changeName } from './account.operations'
import { connect } from 'react-redux'
import { getShift } from '../Storage'
import notificationIcon from '../icons/notification-icon.png'
import maintenanceIcon from '../icons/maintenance.png'

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shift: ''
    }

    this.linkPhone = this.linkPhone.bind(this)
    this.linkText = this.linkText.bind(this)
    this.linkEmail = this.linkEmail.bind(this)
    this.logoutAlert = this.logoutAlert.bind(this)
  }

  componentDidMount() {
    getShift().then(data => {
      this.setState({ shift: `${data / 60} HOURS`})
    }).catch(err => {
      console.log(err);
    })
    this.props.getAccount()
  }

  linkPhone() {
    Linking.canOpenURL('tel:6177770615').then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL('tel:6177770615');
      }
    }).catch(err => console.log('An error occurred', err));
  }

  linkText() {
    Linking.canOpenURL('sms:6177770615').then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL('sms:6177770615');
      }
    }).catch(err => console.log('An error occurred', err));
  }

  linkEmail() {
    Linking.canOpenURL('mailto:admin@streamlineanalytica.com').then(supported => {
      if (!supported) {
        console.log('Can\'t handle url');
      } else {
        return Linking.openURL('mailto:admin@streamlineanalytica.com');
      }
    }).catch(err => console.log('An error occurred', err));
  }

  logoutAlert() {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Logout', onPress: () => this.props.logout(this.props.navigation), style: 'destructive'},
      ],
      { cancelable: false }
    )
  }

  render() {
    return (
      <ScrollView>
        <View style={{marginBottom: 40}}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Notifications')}>
            <Image source={notificationIcon} style={{height: 40, width: 40, marginRight: 10}} />
            <Text style={{fontWeight: 'bold', fontSize: 16, flex: 1}}>Notifications</Text>
            {this.props.badge ?
              <View style={styles.badgeWrapper}>
                <Text style={styles.badge}>{this.props.badge}</Text>
              </View>
              :
              null
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('WorkOrder')}>
            <Image source={maintenanceIcon} style={{height: 40, width: 40, marginRight: 10}} />
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Work Order</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.accountLabel}>Company</Text>
          <Text style={styles.accountText}>{this.props.account.companyName}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.accountLabel}>Shift</Text>
          <Text style={styles.accountText}>{this.state.shift}</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Shifts')}>
            <View style={{backgroundColor: '#FF8300', borderRadius: 8, marginVertical: 10}}>
              <Text style={{fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: 'white'}}>Change Shift</Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.props.names.length > 0 ?
          <View style={styles.wrapper}>
            <Text style={styles.accountLabel}>Line Leader</Text>
            <Text style={styles.accountText}>{this.props.names[this.props.nameIndex].name}</Text>
            <TouchableOpacity onPress={() => this.props.setName(this.props.navigation)}>
              <View style={{backgroundColor: '#FF8300', borderRadius: 8, marginVertical: 10}}>
                <Text style={{fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: 'white'}}>Change Name</Text>
              </View>
            </TouchableOpacity>
          </View>
          :
          null
        }
        <View style={styles.wrapper}>
          <View style={{marginVertical: 10, alignItems: 'center'}}>
            {this.props.account.lineNumbers ?
              <View style={{alignItems: 'center'}}>
                <Text style={styles.accountLabel}>{this.props.account.lineNumbers.length > 1 ? 'Lines' : 'Line'}</Text>
                <Text style={{fontSize: 18, margin: 10}}>{this.props.account.lineNumbers.join(', ')}</Text>
              </View>
              :
              null
            }
            <TouchableOpacity onPress={this.logoutAlert}>
              <View style={{backgroundColor: '#FF8300', borderRadius: 8, marginVertical: 10}}>
                <Text style={{fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: 'white'}}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.accountLabel}>Contact</Text>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <Text style={{fontSize: 18}}>Email:</Text>
            <TouchableOpacity onPress={this.linkEmail}>
              <Text style={{fontSize: 18, marginLeft: 5, color: '#337ab7'}}>admin@streamlineanalytica.com</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    marginBottom: 40,
    padding: 20,
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row'
  },
  accountLabel: {
    fontSize: 24,
    margin: 10,
    color: 'gray'
  },
  accountText: {
    fontSize: 24,
    margin: 10,
  },
  badgeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    backgroundColor: 'red',
    borderRadius: 12,
    overflow: 'hidden',
  },
  badge: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
})

function mapStateToProps(state) {
  return {
    account: state.account.account,
    names: state.splash.names,
    nameIndex: state.name.nameIndex,
    badge: state.pushNotification.badge
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAccount: () => dispatch(handleAccount()),
    logout: (navigation) => dispatch(handleLogout(navigation)),
    setName: (navigation) => dispatch(changeName(navigation))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
