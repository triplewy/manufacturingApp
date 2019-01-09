import React from 'react';
import { Dimensions, View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { username, password, loginUser } from './login.operations'
import { connect } from 'react-redux'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.fadeValue = new Animated.Value(0)

    this.loginFail = this.loginFail.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.error !== prevProps.error && this.props.error) {
      this.loginFail()
    }
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
            value={this.props.username}
            onChangeText={(text) => this.props.setUsername(text)}
          />
          <TextInput
            placeholder='Password'
            secureTextEntry
            autoCapitalize='none'
            autoCorrect={false}
            style={styles.textInput}
            value={this.props.password}
            onChangeText={(text) => this.props.setPassword(text)}
          />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
            <Text style={{color: 'white', marginVertical: 20}}>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.login(this.props.username, this.props.password, this.props.navigation)} disabled={this.props.submitted}>
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Continue</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateAccount')}>
            <View style={{margin: 20}}>
              <Text style={{color: 'white', fontSize: 24}}>Create Account</Text>
            </View>
          </TouchableOpacity> */}
          <Animated.View style={{marginTop: 30, opacity: this.fadeValue}}>
            <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>Incorrect username or password</Text>
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

function mapStateToProps(state) {
  return {
    username: state.login.username,
    password: state.login.password,
    submitted: state.login.submitted,
    error: state.login.error,
    success: state.login.success
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUsername: (text) => dispatch(username(text)),
    setPassword: (text) => dispatch(password(text)),
    login: (username, password, navigation) => dispatch(loginUser(username, password, navigation)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
