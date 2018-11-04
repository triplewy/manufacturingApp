import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import Modal from 'react-native-modal'
import TotalStats from './TotalStats'
import BarGraph from './BarGraph'
import DowntimeStats from './DowntimeStats'
import LinesStats from './LinesStats'
import MachinesStats from './MachinesStats'

export default class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timePeriodArray: ['LAST 24 HOURS', 'LAST 7 DAYS', 'LAST 30 DAYS', 'LAST 12 MONTHS', 'ALL TIME'],
      timePeriod: 1,
      showModal: false,
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
        <View style={{marginVertical: 30, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.timePeriodTitle}>{this.state.timePeriodArray[this.state.timePeriod]}</Text>
          <TouchableOpacity onPress={this.toggleModal}>
            <View style={{backgroundColor: '#FF8300', borderRadius: 8}}>
              <Text style={{fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: 'white'}}>Choose</Text>
            </View>
          </TouchableOpacity>
          <Modal
            isVisible={this.state.showModal}
            onBackdropPress={() => this.setState({ showModal: false })}
            style={{justifyContent: 'center', alignItems: 'center'}}
          >
            <View style={{width: win.width - 100, backgroundColor: 'white', borderRadius: 8}}>
              <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 0)}>
                <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 0 ? '#FF8300' : 'black'}]}>Last 24 Hours</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 1)}>
                <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 1 ? '#FF8300' : 'black'}]}>Last 7 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 2)}>
                <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 2 ? '#FF8300' : 'black'}]}>Last 30 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 3)}>
                <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 3 ? '#FF8300' : 'black'}]}>Last 12 Months</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 4)}>
                <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 4 ? '#FF8300' : 'black'}]}>All Time</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        <TotalStats refreshing={this.state.refreshing} timePeriod={this.state.timePeriod} />
        <DowntimeStats refreshing={this.state.refreshing} timePeriod={this.state.timePeriod} navigation={this.props.navigation} />
        {/* <LinesStats />
        <MachinesStats /> */}
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
