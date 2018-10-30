import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';

export default class MachinesStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      machines: [],
      largestDowntime: 0,
      average: 0
    };

    this.fetchMachinesStats = this.fetchMachinesStats.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchMachinesStats()
  }

  fetchMachinesStats() {
    fetch(global.API_URL + '/api/stats/downtime/machines', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      var machines = []
      var largestDowntime = data[0].totalDowntime
      var average = 0
      for (var i = 0; i < data.length; i++) {
        machines.push({machine: data[i].machineId, downtime: data[i].totalDowntime})
        average += data[i].totalDowntime
        if (largestDowntime < data[i].totalDowntime) {
          largestDowntime = data[i].totalDowntime
        }
      }
      this.setState({machines: machines, largestDowntime: largestDowntime, average: average/data.length})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem(item) {
    const win = Dimensions.get('window');
    var downtime = 0
    if (item.item.downtime) {
      downtime = item.item.downtime
    }
    var height = downtime * 1.0 / this.state.largestDowntime * 200
    return (
      <View style={{alignItems: 'center', height: 300}}>
        <Text style={{flex: 1}}>{downtime}</Text>
        <View style={{height: height, width: (win.width - 100) / 7.0, backgroundColor: 'red', marginHorizontal: 5}} />
        <Text style={{marginTop: 10}}>{item.item.machine}</Text>
      </View>
    )
  }

  render() {
    const win = Dimensions.get('window');
    return (
      <View style={styles.statsView}>
        <Text style={{marginBottom: 20}}>Downtime per machine</Text>
        <FlatList
          horizontal
          data={this.state.machines}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
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
