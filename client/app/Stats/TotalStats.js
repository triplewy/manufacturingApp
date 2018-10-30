import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';

export default class TotalStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      downtime: 0
    };

    this.fetchTotalStats = this.fetchTotalStats.bind(this)
  }

  componentDidMount() {
    this.fetchTotalStats()
  }

  fetchTotalStats() {
    fetch(global.API_URL + '/api/stats/totalDowntime', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({downtime: data.totalDowntime})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={styles.statsView}>
        <Text style={{marginBottom: 20, color: 'gray', fontSize: 18}}>Total Downtime</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 24, fontWeight: '600'}}>{this.state.downtime}</Text>
          <Text style={{fontSize: 24, fontWeight: '600', marginLeft: 5}}>Minutes</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  statsView: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 40
  }
})
