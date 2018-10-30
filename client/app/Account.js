import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

export default class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      company: ''
    };

    this.fetchAccount = this.fetchAccount.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount() {
    this.fetchAccount()
  }

  fetchAccount() {
    fetch(global.API_URL + '/api/account', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({company: data.companyName})
    })
    .catch((error) => {
      console.error(error);
    });
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
      <View>
        <View style={styles.wrapper}>
          <Text style={{fontSize: 24, margin: 10}}>{this.state.company}</Text>
          <Text style={{fontSize: 18, margin: 10}}>Line #</Text>
          <Text style={{fontSize: 18, margin: 10}}>Name</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={{fontSize: 24, margin: 10}}>Contact</Text>
          <Text style={{fontSize: 18, margin: 10}}>Phone #: 888-888-8888</Text>
          <Text style={{fontSize: 18, margin: 10}}>Email: help@bigbooties.com</Text>
        </View>
        <TouchableOpacity onPress={this.logout}>
          <View style={styles.wrapper}>
            <Text style={{fontSize: 18, margin: 10, color: 'red'}}>Logout</Text>
          </View>
      </TouchableOpacity>

      </View>
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
