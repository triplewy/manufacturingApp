import React from 'react';
import { Dimensions, SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.login = this.login.bind(this)
  }

  login(e) {
    console.log(global.API_URL);
    fetch(global.API_URL + '/api/auth/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'not logged in') {
      } else {
        this.props.navigation.navigate('Name')
      }
    })
    .catch(function(err) {
        console.log(err);
    });
  }

  render() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <View style={styles.inputView}>
          <Text style={styles.title}>Sign in</Text>
          <TextInput placeholder='Username' autoCapitalize='none' autoCorrect={false} style={styles.textInput} value={this.state.username} onChangeText={(text) => this.setState({username: text})}/>
          <TextInput placeholder='Password' secureTextEntry autoCapitalize='none' autoCorrect={false} style={styles.textInput} value={this.state.password} onChangeText={(text) => this.setState({password: text})}/>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
            <Text style={{color: 'white', marginVertical: 20}}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.login}>
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const win = Dimensions.get('window');
const styles = StyleSheet.create({
  title: {
    color: '#888888',
    color: 'white',
    fontSize: 48,
    fontWeight: '600',
    marginBottom: 20
  },
  inputView: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    width: win.width - 100,
    borderBottomWidth: 5,
    borderColor: 'white',
    padding: 12,
    color: 'white',
    fontSize: 24,
    margin: 20
  },
  loginButton: {
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
