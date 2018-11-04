import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <View style={{backgroundColor: '#FF8300', justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text style={{textAlign: 'center', fontSize: 48, fontWeight: 'bold', color: 'white'}}>Streamline</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
})
