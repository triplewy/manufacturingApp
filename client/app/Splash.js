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
      <View>
        <View style={{marginTop: 40, borderBottomWidth: 1, borderColor: '#ccc', marginHorizontal: 40}}>
          <Text style={{textAlign: 'center', fontSize: 32, fontWeight: 'bold', padding: 10}}>Feed</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
})
