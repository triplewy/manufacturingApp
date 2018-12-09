import React from 'react';
import { Dimensions, SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { setCookie, clearCookies } from '../Storage'
import validator from 'validator';
import owasp from 'owasp-password-strength-test'

owasp.config({
  maxLength: 128,
  minLength: 8,
  minOptionalTestsToPass: 3
});

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.fadeValue = new Animated.Value(0)
    this.state = {
      username: '',
      usernameIsValid: false,
      password: '',
      confirmPassword: '',
      passwordIsValid: false,
      passwordErrorMessage: '',

      submitted: false
    };

    this.checkUsername = this.checkUsername.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.signup = this.signup.bind(this)
  }

  checkUsername(username) {
    if (username.length < 20) {
      username = username.replace(/\W+/g, '').toLowerCase()
      this.setState({username: username})

      if (validator.isAlphanumeric(username) && username) {
        fetch(global.API_URL + '/api/auth/checkUsername', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.message === 'unique') {
            this.setState({usernameIsValid: true})
          } else {
            this.setState({usernameIsValid: false})
          }
        })
        .catch(function(err) {
            console.log(err);
        })
      } else {
        this.setState({usernameIsValid: false})
      }
    }
  }

  checkPassword(password) {
    this.setState({password: password})
    var owaspResult = owasp.test(password);
    if (owaspResult.strong) {
      this.setState({passwordIsValid: true, passwordErrorMessage: ''})
    } else {
      var errorMessage = ''
      for (var i = 0; i < owaspResult.errors.length; i++) {
        if (owaspResult.errors[i] !== "The password must contain at least one special character.") {
          errorMessage += (owaspResult.errors[i] + ' ')
        }
      }
      this.setState({passwordIsValid: false, passwordErrorMessage: errorMessage})
    }
  }

  signup(e) {
    this.setState({submitted: true})
    clearCookies().then(data => {
      if (data.message === 'success') {
        fetch(global.API_URL + '/api/auth/signup', {
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
          this.setState({submitted: false})
          if (data.message === 'not logged in') {
            console.log("signup error");
          } else {
            this.props.navigation.navigate('Name')
          }
        })
        .catch(function(err) {
            console.log(err);
        });
      } else {
        console.log(data);
      }
    })
  }

  render() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text style={{color: 'white', marginTop: 20, marginLeft: 10, fontSize: 18}}>Back</Text>
        </TouchableOpacity>
        <View style={styles.inputView}>
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            placeholder='Username'
            autoCapitalize='none'
            autoCorrect={false}
            style={[styles.textInput, {borderColor: this.state.usernameIsValid ? '#83D3D6' : 'red'}]}
            value={this.state.username}
            onChangeText={(text) => this.checkUsername(text)}
          />
          <TextInput
            placeholder='Password'
            secureTextEntry
            autoCapitalize='none'
            autoCorrect={false}
            style={[styles.textInput, {borderColor: this.state.passwordIsValid ? '#83D3D6' : 'red'}]}
            value={this.state.password}
            onChangeText={(text) => this.checkPassword(text)}
          />
          <Text style={{color: 'white'}}>{this.state.passwordErrorMessage}</Text>
          <TextInput
            placeholder='Confirm Password'
            secureTextEntry
            autoCapitalize='none'
            autoCorrect={false}
            returnKeyType="go"
            style={[styles.textInput, {borderColor: this.state.password === this.state.confirmPassword && this.state.confirmPassword ? '#83D3D6' : 'red'}]}
            value={this.state.confirmPassword}
            onChangeText={(text) => this.setState({confirmPassword: text})}
            onSubmitEditing={this.signup}
          />
          <TouchableOpacity onPress={this.signup} disabled={!this.state.usernameIsValid || !this.state.passwordIsValid || this.state.password !== this.state.confirmPassword || this.state.submitted}>
            <View style={[styles.loginButton, {backgroundColor: this.state.usernameIsValid && this.state.passwordIsValid && this.state.password === this.state.confirmPassword ? '#83D3D6' : '#f1f1f1'}]}>
              <Text style={styles.loginButtonText}>Continue</Text>
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
    fontSize: 36,
    fontWeight: '600',
    marginBottom: 10
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
    padding: 12,
    color: 'white',
    fontSize: 24,
    margin: 10
  },
  loginButton: {
    alignItems: 'center',
    width: 200,
    borderRadius: 24,
    marginTop: 20
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
    color: 'white'
  }
})
