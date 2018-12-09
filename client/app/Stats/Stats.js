import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import ChooseModal from '../ChooseModal'
import TotalStats from './TotalStats'
import BarGraph from './BarGraph'
import BarGraphVertical from './BarGraphVertical'
import DowntimeStats from './DowntimeStats'
import DowntimeStatsVertical from './DowntimeStatsVertical'
import { fetchLines } from '../fetchLines.js'

export default class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timePeriod: 1,
      lines: [],
      line: 0,
      refreshing: false
    };

    this.setLine = this.setLine.bind(this)
    this.setTimePeriod = this.setTimePeriod.bind(this)
    this.refreshStats = this.refreshStats.bind(this)
  }

  componentDidMount() {
    fetchLines().then(data => {
      this.setState({lines: this.state.lines.concat(data), line: 0})
    })
  }

  setLine(index) {
    this.setState({line: index}, () => {
      this.refreshStats()
    })
  }

  setTimePeriod(index) {
    this.setState({timePeriod: index}, () => {
      this.refreshStats()
    })
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
          index={this.state.timePeriod}
          selectItem={this.setTimePeriod}
        />
        <ChooseModal
          items={this.state.lines}
          index={this.state.line}
          selectItem={this.setLine}
        />
        <TotalStats
          refreshing={this.state.refreshing}
          timePeriod={this.state.timePeriod}
          line={this.state.lines[this.state.line]}
        />
        <DowntimeStatsVertical
          refreshing={this.state.refreshing}
          timePeriod={this.state.timePeriod}
          line={this.state.lines[this.state.line]}
          navigation={this.props.navigation}
        />
        {this.state.lines[this.state.line] ?
          <BarGraphVertical
            title='Machines'
            api_url={'/api/stats/downtime/machines/' + this.state.timePeriod + '/line/' + this.state.lines[this.state.line].lineId}
            refreshing={this.state.refreshing}
          />
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
