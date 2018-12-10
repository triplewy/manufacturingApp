import React from 'react';
import { ScrollView, View, RefreshControl, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import { setLine, setTime } from './stats.operations'
import { connect } from 'react-redux'
import ChooseModal from '../ChooseModal'
import TotalStats from './TotalStats/TotalStats'
import DowntimeStatsVertical from './DowntimeStats/DowntimeStatsVertical'
import MachineStats from './MachineStats/MachineStats'

class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
    this.refreshStats = this.refreshStats.bind(this)
  }

  refreshStats() {
    this.setState({refreshing: true})
    setTimeout(() => {
      this.setState({refreshing: false})
    }, 2000)
  }

  render() {
    const win = Dimensions.get('window');
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refreshStats.bind(this)}
          />
        }
      >
        <ChooseModal
          items={[{name: 'LAST 24 HOURS'}, {name: 'LAST 7 DAYS'}, {name: 'LAST 30 DAYS'}, {name: 'LAST 12 MONTHS'}, {name: 'ALL TIME'}]}
          index={this.props.timePeriod}
          selectItem={this.props.setTimePeriod}
        />
        <ChooseModal
          items={this.props.lines}
          index={this.props.lineIndex}
          selectItem={this.props.setLineIndex}
        />
        <TotalStats
          refreshing={this.state.refreshing}
        />
        <DowntimeStatsVertical
          refreshing={this.state.refreshing}
          navigation={this.props.navigation}
        />
        <MachineStats
          refreshing={this.state.refreshing}
        />
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
    lines: state.splash.lines,
    lineIndex: state.stats.lineIndex,
    timePeriod: state.stats.timePeriod,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLineIndex: (index) => dispatch(setLine(index)),
    setTimePeriod: (index) => dispatch(setTime(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
