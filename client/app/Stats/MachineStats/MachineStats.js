import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import { fetchMachineStats } from './machineStats.operations'
import { connect } from 'react-redux'
import { downtimeString } from '../../DowntimeString.js'

class MachineStats extends React.Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.props.getMachineStats(this.props.lines[this.props.lineIndex].lineId, this.props.timePeriod, this.props.date)
  }

  componentDidUpdate(prevProps) {
    if (this.props.lineIndex !== prevProps.lineIndex || this.props.timePeriod !== prevProps.timePeriod || this.props.date !== prevProps.date) {
      this.props.getMachineStats(this.props.lines[this.props.lineIndex].lineId, this.props.timePeriod, this.props.date)
    }
  }

  renderItem(item) {
    const win = Dimensions.get('window');
    const downtime = item.item.totalDowntime
    const height = downtime / this.props.totalDowntime * 400
    const parsedDowntime = downtimeString(downtime)

    return (
      <View style={{marginBottom: 20, alignItems: 'center', justifyContent: 'center', width: 70, marginRight: 10}}>
        <View style={{flex: 1}} />
        <View style={{marginBottom: 5}}>
          <Text style={{color: 'gray', textAlign: 'center'}}>{parsedDowntime}</Text>
        </View>
        <View style={{height: height, width: 70, backgroundColor: '#FF8300', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>{Math.round(downtime / this.props.totalDowntime * 100) + '%'}</Text>
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
          <Text style={{marginBottom: 10, color: 'gray', fontSize: 18}}>Machines</Text>
        </View>
        <FlatList
          horizontal
          scrollEnabled
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
    downtime: state.machineStats.downtime,
    totalDowntime: state.machineStats.totalDowntime,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getMachineStats: (lineId, timePeriod, date) => dispatch(fetchMachineStats(lineId, timePeriod, date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MachineStats);
