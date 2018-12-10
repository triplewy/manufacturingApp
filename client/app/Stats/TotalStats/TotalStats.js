import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { fetchTotalStats } from './totalStats.operations'
import { connect } from 'react-redux'
import { downtimeString } from '../../DowntimeString.js'

class TotalStats extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getTotalStats(this.props.lines[this.props.lineIndex].lineId, this.props.timePeriod)
  }

  componentDidUpdate(prevProps) {
    if (this.props.timePeriod !== prevProps.timePeriod || this.props.lineIndex !== prevProps.lineIndex) {
      this.props.getTotalStats(this.props.lines[this.props.lineIndex].lineId, this.props.timePeriod)
    }
  }

  render() {
    const parsedDowntime = downtimeString(this.props.downtime)

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

function mapStateToProps(state) {
  return {
    timePeriod: state.stats.timePeriod,
    lineIndex: state.stats.lineIndex,
    lines: state.splash.lines,
    downtime: state.totalStats.downtime
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getTotalStats: (lineId, timePeriod) => dispatch(fetchTotalStats(lineId, timePeriod))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalStats);
