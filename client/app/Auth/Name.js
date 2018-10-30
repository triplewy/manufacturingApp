import React from 'react';
import { Dimensions, SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';

export default class Name extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };

    this.postName = this.postName.bind(this)
  }

  postName(e) {
    fetch(global.API_URL + '/api/auth/name', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: this.state.name,
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'success') {
        this.props.navigation.navigate('Tabs')
      } else {
        console.log(data);
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
          <Text style={styles.title}>Name</Text>
          <TextInput placeholder='Name' autoCapitalize='none' autoCorrect={false} style={styles.textInput} value={this.state.name} onChangeText={(text) => this.setState({name: text})}/>
          <TouchableOpacity onPress={this.postName}>
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Done</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

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
    width: 500,
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
