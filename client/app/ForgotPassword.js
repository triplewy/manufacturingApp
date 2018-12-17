import React from 'react';
import { Dimensions, SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Linking } from 'react-native';

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.linkPhone = this.linkPhone.bind(this)
    this.linkEmail = this.linkEmail.bind(this)
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

  linkEmail() {
    Linking.canOpenURL('mailto:help.stream.lineapp@gmail.com').then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL('mailto:help.stream.lineapp@gmail.com');
      }
    }).catch(err => console.log('An error occurred', err));
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.inputView}>
          <Text style={styles.title}>Forgot Password</Text>
          {/* <View style={{flexDirection: 'row', marginVertical: 10}}>
            <Text style={{fontSize: 18, color: 'white'}}>Call:</Text>
            <TouchableOpacity onPress={this.linkPhone}>
              <Text style={{fontSize: 18, marginLeft: 5, color: '#337ab7'}}>617-777-0615</Text>
            </TouchableOpacity>
          </View> */}
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <Text style={{fontSize: 18, color: 'white'}}>Email:</Text>
            <TouchableOpacity onPress={this.linkEmail}>
              <Text style={{fontSize: 18, marginLeft: 5, color: '#337ab7'}}>help.stream.lineapp@gmail.com</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const win = Dimensions.get('window');
const styles = StyleSheet.create({
  title: {
    color: '#888888',
    color: 'white',
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 10
  },
  inputView: {
    flex: 1,
    padding: 30,
    alignItems: 'center'
  },
  textInput: {
    width: win.width - 100,
    borderBottomWidth: 5,
    borderColor: 'white',
    padding: 12,
    color: 'white',
    fontSize: 24,
    margin: 20,
    textAlign: 'center'
  },
  loginButton: {
    margin: 40,
    alignItems: 'center',
    width: 200,
    backgroundColor: 'blue',
    borderRadius: 24
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
    color: 'white'
  }
})
