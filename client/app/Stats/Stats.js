import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import ChooseModal from '../ChooseModal'
import TotalStats from './TotalStats'
import BarGraph from './BarGraph'
import BarGraphVertical from './BarGraphVertical'
import DowntimeStats from './DowntimeStats'
import DowntimeStatsVertical from './DowntimeStatsVertical'

export default class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timePeriod: 1,
      lines: [],
      line: null,
      refreshing: false
    };

    this.fetchLines = this.fetchLines.bind(this)
    this.refreshStats = this.refreshStats.bind(this)
    this.refreshLine = this.refreshLine.bind(this)
  }

  componentDidMount() {
    this.fetchLines()
  }

  fetchLines() {
    fetch(global.API_URL + '/api/account/lines', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      var lines = []
      for (var i = 0; i < data.length; i++) {
        lines.push({name: 'LINE ' + data[i].lineId, lineId: data[i].lineId})
      }
      this.setState({lines: this.state.lines.concat(lines)})
    })
    .catch((error) => {
      console.error(error);
    })
  }

  refreshStats(index) {
    var timePeriod = index
    if (typeof timePeriod === 'undefined') {
      timePeriod = this.state.timePeriod
    }
    this.setState({refreshing: true, timePeriod: timePeriod})
    setTimeout(() => {
      this.setState({refreshing: false})
    }, 2000)
  }

  refreshLine(index) {
    var line = index
    if (typeof line === 'undefined') {
      line = this.state.line
    }
    this.setState({refreshing: true, line: line})
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
          selectItem={this.refreshStats}
          defaultIndex={1}
        />
        <ChooseModal
          items={this.state.lines}
          selectItem={this.refreshLine}
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
        <BarGraphVertical
          title='Machines'
          api_url={this.state.line ?
            '/api/stats/downtime/machines/' + this.state.timePeriod + '/line/' + this.state.lines[this.state.line].lineId
            :
            '/api/stats/downtime/machines/' + this.state.timePeriod
          }
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
