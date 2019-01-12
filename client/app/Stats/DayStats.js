import React from 'react';
import { ScrollView, View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import { setLine, setDate } from '../Reports/reports.operations'
import { connect } from 'react-redux'
import MachineStats from './MachineStats/MachineStats'
import WorkerStats from './WorkerStats/WorkerStats'
import ShiftStats from './ShiftStats/ShiftStats'
import { parseTime } from '../ParseTime.js'
import { downtimeString } from '../DowntimeString.js'

class DayStats extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state}  = navigation;
    const currDate = parseTime(state.params.timePeriod, state.params.date)
    return {
      title: `${currDate}`,
    }
  }

  constructor(props) {
    super(props);

    this.goToReports = this.goToReports.bind(this)
  }

  goToReports() {
    const date = this.props.navigation.state.params.date
    Promise.all([this.props.setReportsLine(this.props.lineIndex), this.props.setReportsDate(date.substring(0, date.indexOf('T')))])
    .then(() => {
      this.props.navigation.navigate('Reports')
    })
  }

  render() {
    const params = this.props.navigation.state.params
    const downtime = this.props.navigation.state.params.downtime
    const availableMin = this.props.navigation.state.params.availableMin
    const parsedDowntime = downtimeString(downtime)
    return (
      <ScrollView>
        <View style={styles.statsView}>
          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <Text style={{color: 'gray', fontSize: 18, flex: 1}}>Total Downtime</Text>
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold', color: '#73C9D0'}}>{`${Math.round(downtime / availableMin * 100)}%`}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 24, fontWeight: '600', color: '#FF8300', flex: 1}}>{parsedDowntime}</Text>
            <View style={{justifyContent: 'center'}}>
              <Text style={{fontSize: 12, color: 'gray'}}>{`/ ${availableMin / 60} HOURS`}</Text>
            </View>
          </View>
        </View>
        <View>
          <MachineStats date={params.date} />
          {/* <WorkerStats date={params.date} /> */}
          <ShiftStats date={params.date} />
        </View>

        {this.props.timePeriod < 3 ?
          <TouchableOpacity
            style={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}
            onPress={this.goToReports}
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

function mapStateToProps(state) {
  return {
    timePeriod: state.stats.timePeriod,
    lineIndex: state.stats.lineIndex,
    lines: state.splash.lines,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setReportsLine: (index) => dispatch(setLine(index)),
    setReportsDate: (date) => dispatch(setDate(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DayStats);
