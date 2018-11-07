import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import ChooseModal from '../ChooseModal'
import TotalStats from './TotalStats'
import BarGraph from './BarGraph'
import DowntimeStats from './DowntimeStats'
import LinesStats from './LinesStats'
import MachinesStats from './MachinesStats'

export default class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timePeriod: 1,
      refreshing: false
    };

    this.toggleModal = this.toggleModal.bind(this)
    this.selectTimePeriod = this.selectTimePeriod.bind(this)
    this.refreshStats = this.refreshStats.bind(this)
  }

  toggleModal(visible) {
    this.setState({showModal: !this.state.showModal});
  }

  selectTimePeriod(index) {
    this.setState({timePeriod: index, showModal: false})
    this.refreshStats()
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
        <TotalStats refreshing={this.state.refreshing} timePeriod={this.state.timePeriod} />
        <DowntimeStats refreshing={this.state.refreshing} timePeriod={this.state.timePeriod} navigation={this.props.navigation} />
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
