import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, Image, TouchableOpacity, Linking, Alert} from 'react-native';
import machineIcon from './icons/machine-icon.png'
import { getName } from './Storage'

export default class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      account: {}
    };

    this.fetchAccount = this.fetchAccount.bind(this)
    this.linkPhone = this.linkPhone.bind(this)
    this.linkText = this.linkText.bind(this)
    this.linkEmail = this.linkEmail.bind(this)
    this.logoutAlert = this.logoutAlert.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    getName().then(name => {
      this.setState({name: name})
    })
    this.fetchAccount()
  }

  fetchAccount() {
    fetch(global.API_URL + '/api/account', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({account: data})
    })
    .catch((error) => {
      console.error(error);
    });
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
    Linking.canOpenURL('mailto:help@example.com').then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL('mailto:help@example.com');
      }
    }).catch(err => console.log('An error occurred', err));
  }

  logoutAlert() {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Logout', onPress: () => this.logout(), style: 'destructive'},
      ],
      { cancelable: false }
    )
  }

  logout() {
    fetch(global.API_URL + '/api/auth/logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'success') {
        this.props.navigation.navigate('Auth')
      } else {
        console.log(data);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={{alignItems: 'center', justifyContent: 'center', margin: 20}}>
          <Image
            source={machineIcon}
            style={{width: 100, height: 100, borderRadius: 8}}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={{fontSize: 32, margin: 10, color: 'gray'}}>{this.state.account.companyName}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 18, margin: 10}}>Day Shift:</Text>
            <Text style={{fontSize: 18, margin: 10}}>{this.state.account.morningShift + 'AM - ' + (this.state.account.eveningShift - 12) + 'PM'}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 18, margin: 10}}>Night Shift:</Text>
            <Text style={{fontSize: 18, margin: 10}}>{(this.state.account.eveningShift - 12) + 'PM - ' + this.state.account.morningShift + 'AM'}</Text>
          </View>
        </View>
        <View style={styles.wrapper}>
          {this.state.account.lineNumbers ?
            <View style={{marginVertical: 10, alignItems: 'center'}}>
              <Text style={{fontSize: 24, marginBottom: 10, color: 'gray'}}>{this.state.account.lineNumbers.length > 1 ? 'Lines' : 'Line'}</Text>
              <Text style={{fontSize: 18}}>{this.state.account.lineNumbers.join(', ')}</Text>
            </View>
            :
            null
          }
        </View>
        <View style={styles.wrapper}>
          <Text style={{fontSize: 24, margin: 10, color: 'gray'}}>Line Leader</Text>
          <Text style={{fontSize: 24, margin: 10}}>{this.state.name}</Text>
          <TouchableOpacity>
            <View style={{backgroundColor: '#FF8300', borderRadius: 8, marginVertical: 10}}>
              <Text style={{fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: 'white'}}>Change Name</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapper}>
          <Text style={{fontSize: 24, margin: 10}}>Contact</Text>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <Text style={{fontSize: 18}}>Call:</Text>
            <TouchableOpacity onPress={this.linkPhone}>
              <Text style={{fontSize: 18, marginLeft: 5, color: '#337ab7'}}>888-888-8888</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <Text style={{fontSize: 18}}>Text:</Text>
            <TouchableOpacity onPress={this.linkText}>
              <Text style={{fontSize: 18, marginLeft: 5, color: '#337ab7'}}>888-888-8888</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <Text style={{fontSize: 18}}>Email:</Text>
            <TouchableOpacity onPress={this.linkEmail}>
              <Text style={{fontSize: 18, marginLeft: 5, color: '#337ab7'}}>help@example.com</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={this.logoutAlert}>
          <View style={styles.wrapper}>
            <Text style={{fontSize: 18, margin: 10, color: 'red'}}>Logout</Text>
          </View>
      </TouchableOpacity>
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
})
