import React from 'react';
import { Dimensions, SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    return (
      <SafeAreaView style={{justifyContent: 'center', flex: 1}}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text style={{color: 'white', padding: 30, fontSize: 18}}>Back</Text>
        </TouchableOpacity>
        <View style={styles.inputView}>
          <Text style={styles.title}>Forgot Password</Text>
        </View>
      </SafeAreaView>
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
