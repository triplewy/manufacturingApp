import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions, Animated, Easing} from 'react-native';
import { parseTime } from '../ParseTime.js'
import { downtimeString } from '../DowntimeString.js'

export default class DowntimeStatsVertical extends React.Component {
  constructor(props) {
    super(props);
    this.fadeValue = new Animated.Value(0)
    this.state = {
      downtime: [],
      totalDowntime: 0,
      average: 0
    };

    this.fadeIn = this.fadeIn.bind(this)
    this.fadeOut = this.fadeOut.bind(this)
    this.fetchDowntimeStats = this.fetchDowntimeStats.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchDowntimeStats()
    this.fadeValue.setValue(0)
    this.fadeIn()
  }

  fadeIn() {
    Animated.timing(
      this.fadeValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.ease
      }
    ).start(() => this.fadeOut())
  }

  fadeOut() {
    Animated.timing(
      this.fadeValue,
      {
        toValue: 0,
        duration: 2000,
        easing: Easing.ease
      }
    ).start(() => this.fadeIn())
  }

  componentDidUpdate(prevProps) {
    if (this.props.refreshing && this.props.refreshing !== prevProps.refreshing) {
      this.fetchDowntimeStats()
    }
  }

  fetchDowntimeStats() {
    var url = global.API_URL + '/api/stats/downtime/time/' + this.props.timePeriod
    if (this.props.line) {
      url += '/line/' + this.props.line.lineId
    }
    fetch(url, {credentials: 'include'})
    .then(res => res.json())
    .then(data => {
      console.log(data);
      var downtime = []
      var average = 0
      for (var i = 0; i < data.length; i++) {
        downtime.push({time: data[i].time, downtime: data[i].totalDowntime})
        average += data[i].totalDowntime
      }
      this.setState({downtime: downtime, totalDowntime: average, average: average/data.length})
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
    const height = downtime / this.state.totalDowntime * 400
    const parsedDowntime = downtimeString(downtime)

    if (downtime !== 0) {
      return (
        <View style={{marginBottom: 20, alignItems: 'center', justifyContent: 'center', width: 80}}>
          <View style={{flex:1}} />
          <View style={{marginBottom: 5}}>
            <Text style={{color: 'gray', textAlign: 'center'}}>{parsedDowntime}</Text>
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('DayStats', {date: item.item.time, timePeriod: this.props.timePeriod, downtime: downtime, line: this.props.line})}>
            <View style={{height: height, width: 70, backgroundColor: '#FF8300', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
              <Animated.View style={{opacity: this.fadeValue}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>{Math.round(downtime / this.state.totalDowntime * 100) + '%'}</Text>
              </Animated.View>
            </View>
          </TouchableOpacity>
          <Text style={{color: 'gray', marginTop: 10}}>{currDate}</Text>
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
        <Text style={{marginBottom: 10, color: 'gray', fontSize: 18}}>Downtime</Text>
        <FlatList
          horizontal
          scrollEnabled
          data={this.state.downtime}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingVertical: 10}}
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
