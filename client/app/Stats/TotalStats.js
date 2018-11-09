import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import { downtimeString } from '../DowntimeString.js'

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

  componentDidUpdate(prevProps) {
    if (this.props.refreshing && this.props.refreshing !== prevProps.refreshing) {
      this.fetchTotalStats()
    }
  }

  fetchTotalStats() {
    var query = global.API_URL + '/api/stats/totalDowntime/' + this.props.timePeriod
    if (this.props.line) {
      query += '/' + this.props.line.lineId
    }
    fetch(query, {credentials: 'include'})
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
    const parsedDowntime = downtimeString(this.state.downtime)

    return (
      <View style={styles.statsView}>
        <Text style={{marginBottom: 20, color: 'gray', fontSize: 18}}>Total Downtime</Text>
        <Text style={{fontSize: 24, fontWeight: '600', color: '#FF8300'}}>{parsedDowntime}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  statsView: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 60
  }
})
