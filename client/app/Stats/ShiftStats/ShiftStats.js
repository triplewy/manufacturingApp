import React from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import { fetchShiftStats } from './shiftStats.operations'
import { connect } from 'react-redux'
import { downtimeString } from '../../DowntimeString.js'

class ShiftStats extends React.Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.props.getShiftStats(this.props.lines[this.props.lineIndex].lineId, this.props.timePeriod, this.props.date)
  }



  renderItem(item) {
    const win = Dimensions.get('window');
    const downtime = item.item.totalDowntime
    const width = downtime / this.props.totalDowntime * (win.width - 40)
    const parsedDowntime = downtimeString(downtime)

    return (
      <View style={{marginBottom: 20}}>
        <View style={{flexDirection: 'row', marginBottom: 5}}>
          <Text style={{color: 'gray', flex: 1}}>{item.item.name}</Text>
          <Text style={{color: 'gray'}}>{parsedDowntime}</Text>
        </View>
        <View style={{height: 50, width: width, backgroundColor: '#FF8300', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>{Math.round(downtime / this.props.totalDowntime * 100) + '%'}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.statsView}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginBottom: 10, color: 'gray', fontSize: 18}}>Shifts</Text>
        </View>
        <FlatList
          data={this.props.downtime}
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

function mapStateToProps(state) {
  return {
    timePeriod: state.stats.timePeriod,
    lineIndex: state.stats.lineIndex,
    lines: state.splash.lines,
    downtime: state.shiftStats.downtime,
    totalDowntime: state.shiftStats.totalDowntime,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getShiftStats: (lineId, timePeriod, date) => dispatch(fetchShiftStats(lineId, timePeriod, date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShiftStats);
