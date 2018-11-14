import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import { downtimeString } from '../DowntimeString.js'

export default class BarGraphVertical extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      totalDowntime: 0,
      average: 0
    };

    this.fetchStats = this.fetchStats.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchStats()
  }

  componentDidUpdate(prevProps) {
    if (this.props.refreshing && this.props.refreshing !== prevProps.refreshing) {
      this.fetchStats()
    }
  }

  fetchStats() {
    fetch(global.API_URL + this.props.api_url, {credentials: 'include'})
    .then(res => res.json())
    .then(data => {
      var arr = []
      var average = 0

      for (var i = 0; i < data.length; i++) {
        arr.push(data[i])
        average += data[i].totalDowntime
      }

      this.setState({data: arr, totalDowntime: average, average: average/7})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem(item) {
    const win = Dimensions.get('window');
    const downtime = item.item.totalDowntime
    const height = downtime / this.state.totalDowntime * 400
    const parsedDowntime = downtimeString(downtime)

    return (
      <View style={{marginBottom: 20, alignItems: 'center', justifyContent: 'center', width: 70, marginRight: 10}}>
        <View style={{flex: 1}} />
        <View style={{marginBottom: 5}}>
          <Text style={{color: 'gray', textAlign: 'center'}}>{parsedDowntime}</Text>
        </View>
        <View style={{height: height, width: 70, backgroundColor: this.props.lineColors ? this.props.lineColors[item.item.lineId] : '#FF8300', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>{Math.round(downtime / this.state.totalDowntime * 100) + '%'}</Text>
        </View>
        <View style={{height: 40}}>
          <Text style={{color: 'gray', marginTop: 10, fontSize: 12}}>{item.item.name}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.statsView}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginBottom: 10, color: 'gray', fontSize: 18}}>{this.props.title}</Text>
        </View>
        <FlatList
          horizontal
          scrollEnabled
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingVertical: 10}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  timePeriodTitle: {
    flex: 1,
    fontSize: 18,
  },
  timePeriodToggle: {
    fontSize: 21,
    padding: 20
  },
  statsView: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 40
  }
})
