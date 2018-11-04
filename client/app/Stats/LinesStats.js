import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';

export default class LinesStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lines: [],
      largestDowntime: 0,
      average: 0
    };

    this.fetchLinesStats = this.fetchLinesStats.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchLinesStats()
  }

  fetchLinesStats() {
    fetch(global.API_URL + '/api/stats/downtime/lines', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      var lines = []
      var largestDowntime = data[0].totalDowntime
      var average = 0
      for (var i = 0; i < data.length; i++) {
        lines.push({line: data[i].lineId, downtime: data[i].totalDowntime})
        average += data[i].totalDowntime
        if (largestDowntime < data[i].totalDowntime) {
          largestDowntime = data[i].totalDowntime
        }
      }
      this.setState({lines: lines, largestDowntime: largestDowntime, average: average/data.length})
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
        <View style={{height: height, width: (win.width - 100) / 7.0, backgroundColor: 'red', marginHorizontal: 5, borderRadius: 4}} />
        <Text style={{marginTop: 10}}>{item.item.line}</Text>
      </View>
    )
  }

  render() {
    const win = Dimensions.get('window');
    return (
      <View style={styles.statsView}>
        <Text style={{marginBottom: 20}}>Downtime per line</Text>
        <FlatList
          horizontal
          data={this.state.lines}
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
