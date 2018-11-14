import React from 'react';
import { Dimensions, SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import {setCookie} from '../Storage'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.fadeValue = new Animated.Value(0)
    this.state = {
      username: '',
      password: '',
    };

    this.login = this.login.bind(this)
    this.loginFail = this.loginFail.bind(this)
  }

  login(e) {
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
    .then(res => {
      console.log(res);
      if (res.headers.get("set-cookie")) {
        console.log("set cookie is", res.headers.get("set-cookie"));
        return setCookie(res.headers.get("set-cookie")).then(data => {
          if (data.message === 'success') {
            return res.json()
          } else {
            console.log(data);
          }
        })
        .catch(err => {
          console.log(err);
        })
      } else {
        if (res.status === 401) {
          return {message: 'not logged in'}
        } else {
          return res.json()
        }
      }
    })
    .then(data => {
      console.log(data);
      if (data.message === 'not logged in') {
        // this.setState({failedLogin: 1})
        this.loginFail()
      } else {
        this.props.navigation.navigate('Name')
      }
    })
    .catch(function(err) {
        console.log(err);
    });
  }

  loginFail() {
    this.fadeValue.setValue(0)
    Animated.timing(
      this.fadeValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease
      }
    ).start()
  }

  render() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <View style={styles.inputView}>
          <Text style={styles.title}>Sign in</Text>
          <TextInput
            placeholder='Username'
            autoCapitalize='none'
            autoCorrect={false}
            style={styles.textInput}
            value={this.state.username}
            onChangeText={(text) => this.setState({username: text})}
          />
          <TextInput
            placeholder='Password'
            secureTextEntry
            autoCapitalize='none'
            autoCorrect={false}
            returnKeyType="go"
            style={styles.textInput}
            value={this.state.password}
            onChangeText={(text) => this.setState({password: text})}
            onSubmitEditing={this.login}
          />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
            <Text style={{color: 'white', marginVertical: 20}}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.login}>
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Continue</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateAccount')}>
            <View style={{margin: 20}}>
              <Text style={{color: 'white', fontSize: 24}}>Create Account</Text>
            </View>
          </TouchableOpacity>
          <Animated.View style={{marginTop: 30, opacity: this.fadeValue}}>
            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Incorrect username or password</Text>
          </Animated.View>
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
    backgroundColor: '#83D3D6',
    borderRadius: 24
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
    color: 'white'
  }
})
