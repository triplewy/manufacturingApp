import React from 'react';
import { Dimensions, SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { setName } from '../Storage'

export default class Name extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };

    this.postName = this.postName.bind(this)
  }

  postName(e) {
    setName(this.state.name).then(data => {
      if (data.message === 'success') {
        this.props.navigation.navigate('Tabs')
      } else {
        console.log(data);
      }
    })
    // fetch(global.API_URL + '/api/auth/name', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   credentials: 'include',
    //   body: JSON.stringify({
    //     name: this.state.name,
    //   })
    // })
    // .then(res => res.json())
    // .then(data => {
    //   if (data.message === 'success') {
    //     setName(this.state.name).then(data => {
    //       if (data.message === 'success') {
    //         this.props.navigation.navigate('Tabs')
    //       } else {
    //         console.log(data);
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     })
    //   } else {
    //     console.log(data);
    //   }
    // })
    // .catch(function(err) {
    //     console.log(err);
    // });
  }

  render() {
    return (
      <View style={{justifyContent: 'center', flex: 1, backgroundColor: '#FF8300'}}>
        <View style={styles.inputView}>
          <Text style={styles.title}>Name</Text>
          <TextInput
            placeholder='Name'
            autoCapitalize='words'
            autoCorrect={false}
            style={styles.textInput}
            value={this.state.name}
            onChangeText={(text) => this.setState({name: text})}
            returnKeyType="done"
            onSubmitEditing={this.postName}
          />
          <TouchableOpacity onPress={this.postName} disabled={this.state.name.length === 0}>
            <View style={[styles.loginButton, {backgroundColor: this.state.name.length > 0 ? 'blue' : 'white'}]}>
              <Text style={[styles.loginButtonText, {color: this.state.name.length > 0 ? 'white' : '#f1f1f1'}]}>Done</Text>
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
    margin: 40,
    alignItems: 'center',
    width: 200,
    borderRadius: 24
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
  }
})
