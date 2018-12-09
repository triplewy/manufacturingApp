import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import BarGraph from './BarGraph'
import BarGraphVertical from './BarGraphVertical'
import MachinesGraphVertical from './MachinesGraphVertical'
import TotalStats from './TotalStats'
import { parseTime } from '../ParseTime.js'
import { downtimeString } from '../DowntimeString.js'

export default class DayStats extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state}  = navigation;
    const currDate = parseTime(state.params.timePeriod, state.params.date)
    return {
      title: `${currDate}`,
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      colors: null
    };

    this.updateColors = this.updateColors.bind(this)
  }

  updateColors(colors) {
    this.setState({colors: colors})
  }

  render() {
    const params = this.props.navigation.state.params
    const downtime = this.props.navigation.state.params.downtime
    const parsedDowntime = downtimeString(downtime)
    return (
      <ScrollView>
        <View style={styles.statsView}>
          <Text style={{marginBottom: 20, color: 'gray', fontSize: 18}}>Total Downtime</Text>
          <Text style={{fontSize: 24, fontWeight: '600', color: '#FF8300'}}>{parsedDowntime}</Text>
        </View>
        {params.line ?
          <View>
            {/* <MachinesGraphVertical
              title='Machines'
              api_url={'/api/stats/downtime/machines/line/' + params.line.lineId + '/' + params.timePeriod + '/' + params.date}
              date={params.date}
              lineId={params.line.lineId}
              {...this.props}
            /> */}
            <BarGraphVertical
              title='Machines'
              api_url={'/api/stats/downtime/machines/line/' + params.line.lineId + '/' + params.timePeriod + '/' + params.date}
              date={params.date}
            />
            <BarGraph title='Shifts' api_url={'/api/stats/downtime/shifts/line=' + params.line.lineId + '/' + params.timePeriod + '/' + params.date} />
          </View>
        :
        null
        }
        {params.timePeriod < 3 ?
          <TouchableOpacity
            style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}
            onPress={() => this.props.navigation.navigate('Reports', {date: params.date, lineId: params.line.lineId})}
          >
            <Text style={{color: '#FF8300', fontSize: 24, padding: 30}}>GO TO REPORTS</Text>
          </TouchableOpacity>
          :
          null
        }
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
