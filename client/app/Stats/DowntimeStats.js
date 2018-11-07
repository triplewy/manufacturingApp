import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import { parseTime } from '../ParseTime.js'

export default class DowntimeStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      downtime: [],
      largestDowntime: 0,
      totalDowntime: 0,
      average: 0
    };

    this.fetchDowntimeStats = this.fetchDowntimeStats.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchDowntimeStats()
  }

  componentDidUpdate(prevProps) {
    if (this.props.refreshing && this.props.refreshing !== prevProps.refreshing) {
      this.fetchDowntimeStats()
    }
  }

  fetchDowntimeStats() {
    fetch(global.API_URL + '/api/stats/downtime/time/' + this.props.timePeriod, {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      var downtime = []
      var largestDowntime = data[0].totalDowntime
      var average = 0
      for (var i = 0; i < data.length; i++) {
        downtime.push({time: data[i].time, downtime: data[i].totalDowntime})
        average += data[i].totalDowntime
        if (largestDowntime < data[i].totalDowntime) {
          largestDowntime = data[i].totalDowntime
        }
      }
      this.setState({downtime: downtime, largestDowntime: largestDowntime, totalDowntime: average, average: average/data.length})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem(item) {
    const win = Dimensions.get('window');
    var currDate = parseTime(this.props.timePeriod, item.item.time)

    var downtime = 0
    if (item.item.downtime) {
      downtime = item.item.downtime
    }
    var height = downtime * 1.0 / this.state.largestDowntime * 400
    const hours = Math.floor(downtime / 60)
    const minutes = downtime % 60

    if (downtime !== 0) {
      return (
        <View style={{alignItems: 'center', marginHorizontal: 10}}>
          <View style={{flex: 1}}/>
          {hours !== 0 ?
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <Text>{hours}</Text>
              <Text style={{marginLeft: 5}}>Hours</Text>
            </View>
          :
            null
          }
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <Text>{minutes}</Text>
            <Text style={{marginLeft: 5}}>Min</Text>
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('DayStats', {date: item.item.time, timePeriod: this.props.timePeriod, downtime: downtime})}>
            <View style={{height: height, width: 100, borderColor: '#FF8300', borderWidth: 2, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: '#FF8300', fontWeight: 'bold'}}>{Math.round(downtime / this.state.totalDowntime * 100) + '%'}</Text>
            </View>
          </TouchableOpacity>
          <Text style={{marginTop: 10}}>{currDate}</Text>
        </View>
      )
    } else {
      return null
    }

  }

  render() {
    const win = Dimensions.get('window');
    return (
      <View style={styles.statsView}>
        <Text style={{marginBottom: 20, color: 'gray', fontSize: 18}}>Downtime</Text>
        <FlatList
          horizontal
          data={this.state.downtime}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
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
