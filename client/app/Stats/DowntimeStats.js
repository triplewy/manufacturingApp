import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';

export default class DowntimeStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      downtime: [],
      largestDowntime: 0,
      average: 0
    };

    this.fetchDowntimeStats = this.fetchDowntimeStats.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchDowntimeStats()
  }

  fetchDowntimeStats() {
    fetch(global.API_URL + '/api/stats/downtime/time', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      var downtime = []
      var largestDowntime = data[0].totalDowntime
      var average = 0
      for (var i = 0; i < 7; i++) {
        downtime.push({day: data[i].day, downtime: data[i].totalDowntime})
        average += data[i].totalDowntime
        if (largestDowntime < data[i].totalDowntime) {
          largestDowntime = data[i].totalDowntime
        }
      }
      this.setState({downtime: downtime, largestDowntime: largestDowntime, average: average/7})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem(item) {
    const win = Dimensions.get('window');
    var options = { weekday: 'short', month: 'short', day: 'numeric' };
    var currDate = new Date(item.item.day).toLocaleDateString('en-US', options)
    var downtime = 0
    if (item.item.downtime) {
      downtime = item.item.downtime
    }
    var height = downtime * 1.0 / this.state.largestDowntime * 200
    return (
      <View style={{alignItems: 'center', height: 300}}>
        <Text style={{flex: 1}}>{downtime}</Text>
        <View style={{height: height, width: (win.width - 100) / 7.0, backgroundColor: 'red', marginHorizontal: 5}} />
        <Text style={{marginTop: 10}}>{currDate}</Text>
      </View>
    )
  }

  render() {
    const win = Dimensions.get('window');
    return (
      <View style={styles.statsView}>
        <Text style={{marginBottom: 20, color: 'gray', fontSize: 18}}>Downtime per day</Text>
        <FlatList
          scrollEnabled={false}
          data={this.state.downtime}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={7}
          contentContainerStyle={{paddingVertical: 20}}
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
