import React from 'react';
import { ScrollView, View, RefreshControl, StyleSheet, Text, Image, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { fetchAccount, fetchLogout, changeName } from './account.operations'
import { connect } from 'react-redux'
import notificationIcon from '../icons/notification-icon.png'

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.linkPhone = this.linkPhone.bind(this)
    this.linkText = this.linkText.bind(this)
    this.linkEmail = this.linkEmail.bind(this)
    this.logoutAlert = this.logoutAlert.bind(this)
  }

  componentDidMount() {
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
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL('mailto:help.stream.lineapp@gmail.com');
      }
    }).catch(err => console.log('An error occurred', err));
  }

  logoutAlert() {
    Alert.alert(
      'Change lines',
      'Changing lines will log you out. Are you sure?',
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
        <TouchableOpacity style={[styles.wrapper, {flexDirection: 'row'}]} onPress={() => this.props.navigation.navigate('Notifications')}>
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
        <View style={styles.wrapper}>
          <Text style={styles.accountLabel}>Company</Text>
          <Text style={styles.accountText}>{this.props.account.companyName}</Text>
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
                <Text style={{fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: 'white'}}>Change Lines</Text>
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
    getAccount: () => dispatch(fetchAccount()),
    logout: (navigation) => dispatch(fetchLogout(navigation)),
    setName: (navigation) => dispatch(changeName(navigation))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
