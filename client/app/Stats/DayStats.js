import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import BarGraph from './BarGraph'
import TotalStats from './TotalStats'

export default class DayStats extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state}  = navigation;
    var currDate = ''
    switch (state.params.timePeriod) {
      case 0:
        options = {hour: 'numeric', hour12: true }
        currDate = new Date(state.params.date).toLocaleString('en-US', options)
        break;
      case 1:
        options = {weekday: 'long', month: 'long', day: 'numeric'}
        currDate = new Date(state.params.date).toLocaleDateString('en-US', options)
        break;
      case 2:
        options = {weekday: 'long', month: 'long', day: 'numeric'}
        currDate = new Date(state.params.date).toLocaleDateString('en-US', options)
        break;
      case 3:
        options = {month: 'long'}
        currDate = new Date(state.params.date).toLocaleDateString('en-US', options)
        break;
      case 4:
        options = {year: 'numeric'}
        currDate = new Date(state.params.date).toLocaleDateString('en-US', options)
        break;
      default:
        options = {weekday: 'long', month: 'long', day: 'numeric'}
        currDate = new Date(state.params.date).toLocaleDateString('en-US', options)
    }
    return {
      title: `${currDate}`,
    }
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const downtime = this.props.navigation.state.params.downtime
    const hours = Math.floor(downtime / 60)
    const minutes = downtime % 60
    return (
      <ScrollView>
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
        <BarGraph title='Lines' api_url='/api/stats/downtime/day/lines/' date={this.props.navigation.state.params.date} />
        <BarGraph title='Machines' api_url='/api/stats/downtime/day/machines/' date={this.props.navigation.state.params.date} />
        <BarGraph title='Shifts' api_url='/api/stats/downtime/day/shifts/' date={this.props.navigation.state.params.date} />
      </ScrollView>
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
