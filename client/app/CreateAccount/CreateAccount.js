import React from 'react';
import { Dimensions, View, SafeAreaView, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { username, password, confirmPassword, signupUser } from './createAccount.operations'
import { connect } from 'react-redux'

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.inputView}>
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            placeholder='Username'
            autoCapitalize='none'
            autoCorrect={false}
            style={[styles.textInput, {borderColor: this.props.username ? '#83D3D6' : 'red'}]}
            value={this.props.username}
            onChangeText={(text) => this.props.setUsername(text)}
          />
          <TextInput
            placeholder='Password'
            secureTextEntry
            autoCapitalize='none'
            autoCorrect={false}
            style={[styles.textInput, {borderColor: this.props.password.length < 6 ? 'red' : '#83D3D6'}]}
            value={this.props.password}
            onChangeText={(text) => this.props.setPassword(text)}
          />
          <Text style={{color: 'white'}}>{this.props.password && this.props.password.length < 6 ? 'Password must have at least 6 characters' : ''}</Text>
          <TextInput
            placeholder='Confirm Password'
            secureTextEntry
            autoCapitalize='none'
            autoCorrect={false}
            returnKeyType="go"
            style={[styles.textInput, {borderColor: this.props.confirmPassword.length > 5 && this.props.password === this.props.confirmPassword ? '#83D3D6' : 'red'}]}
            value={this.props.confirmPassword}
            onChangeText={(text) => this.props.setConfirmPassword(text)}
          />
          <TouchableOpacity
            onPress={() => this.props.signup(this.props.username, this.props.password, this.props.confirmPassword, this.props.navigation)}
            disabled={!this.props.username || this.props.password.length < 6 || this.props.password !== this.props.confirmPassword || this.props.submitted}
          >
            <View style={[styles.loginButton, {backgroundColor: this.props.username && this.props.password.length > 5 && this.props.password === this.props.confirmPassword ? '#83D3D6' : '#f1f1f1'}]}>
              <Text style={styles.loginButtonText}>Continue</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.loginButtonText}>{this.props.error}</Text>
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
    borderRadius: 24,
    marginTop: 30
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
    color: 'white'
  }
})

function mapStateToProps(state) {
  return {
    username: state.createAccount.username,
    password: state.createAccount.password,
    confirmPassword: state.createAccount.confirmPassword,
    submitted: state.createAccount.submitted,
    error: state.createAccount.error
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUsername: (text) => dispatch(username(text)),
    setPassword: (text) => dispatch(password(text)),
    setConfirmPassword: (text) => dispatch(confirmPassword(text)),
    signup: (username, password, confirmPassword, navigation) => dispatch(signupUser(username, password, confirmPassword, navigation)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
