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

  componentDidUpdate(prevProps) {
    if (this.props.refreshing && this.props.refreshing !== prevProps.refreshing) {
      this.fetchTotalStats()
    }
  }

  fetchTotalStats() {
    var query = global.API_URL + '/api/stats/totalDowntime/' + this.props.timePeriod
    if (this.props.date) {
      query += '/' + this.props.date
    }
    fetch(query, {
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
    const hours = Math.floor(this.state.downtime / 60)
    const minutes = this.state.downtime % 60
    return (
      <View style={styles.statsView}>
        <Text style={{marginBottom: 20, color: 'gray', fontSize: 18}}>Total Downtime</Text>
        <View style={{flexDirection: 'row'}}>
          {hours !== 0 ?
            <View style={{flexDirection: 'row', marginRight: 10}}>
              <Text style={{fontSize: 24, fontWeight: '600', color: '#FF8300'}}>{hours}</Text>
              <Text style={{fontSize: 24, fontWeight: '600', marginLeft: 5, color: '#FF8300'}}>Hours</Text>
            </View>
          :
            null
          }
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 24, fontWeight: '600', color: '#FF8300'}}>{minutes}</Text>
            <Text style={{fontSize: 24, fontWeight: '600', marginLeft: 5, color: '#FF8300'}}>Minutes</Text>
          </View>
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
