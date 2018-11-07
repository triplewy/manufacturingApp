import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';

export default class BarGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      largestDowntime: 0,
      totalDowntime: 0,
      average: 0
    };

    this.fetchStats = this.fetchStats.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchStats()
  }

  fetchStats() {
    fetch(global.API_URL + this.props.api_url + this.props.date, {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        var arr = []
        var largestDowntime = data[0].totalDowntime
        var average = 0
        for (var i = 0; i < data.length; i++) {
          arr.push(data[i])
          average += data[i].totalDowntime
          if (largestDowntime < data[i].totalDowntime) {
            largestDowntime = data[i].totalDowntime
          }
        }
        this.setState({data: arr, largestDowntime: largestDowntime, totalDowntime: average, average: average/7})
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem(item) {
    var downtime = item.item.totalDowntime
    var height = downtime * 1.0 / this.state.largestDowntime * 200
    const win = Dimensions.get('window');
    const hours = Math.floor(downtime / 60)
    const minutes = downtime % 60
    return (
      <View style={{alignItems: 'center', height: 300, marginHorizontal: 10}}>
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
        <View style={{height: height, width: (win.width - 20) / 6, backgroundColor: '#FF8300', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{Math.round(downtime / this.state.totalDowntime * 100) + '%'}</Text>
        </View>
        <Text style={{marginTop: 10, fontSize: 16}}>{item.item.name}</Text>
      </View>
    )
  }

  render() {
    const win = Dimensions.get('window');
    return (
      <View style={styles.statsView}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginBottom: 20, color: 'gray', fontSize: 18}}>{this.props.title}</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingVertical: 20}}
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
