import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import Modal from 'react-native-modal'

export default class TimePeriodModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timePeriodArray: ['LAST 24 HOURS', 'LAST 7 DAYS', 'LAST 30 DAYS', 'LAST 12 MONTHS', 'ALL TIME'],
      timePeriod: 1,
      showModal: false
    };

    this.toggleModal = this.toggleModal.bind(this)
    this.selectTimePeriod = this.selectTimePeriod.bind(this)
  }

  toggleModal(visible) {
    this.setState({showModal: !this.state.showModal});
  }

  selectTimePeriod(index) {
    this.setState({timePeriod: index, showModal: false})
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.toggleModal}>
          <Text style={{fontSize: 18}}>Choose</Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.showModal}
          onBackdropPress={() => this.setState({ showModal: false })}
        >
          <View style={{width: win.width - 100, backgroundColor: 'white', borderRadius: 8}}>
            <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 0)}>
              <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 0 ? 'red' : 'black'}]}>Last 24 Hours</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 1)}>
              <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 1 ? 'red' : 'black'}]}>Last 7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 2)}>
              <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 2 ? 'red' : 'black'}]}>Last 30 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 3)}>
              <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 3 ? 'red' : 'black'}]}>Last 12 Months</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectTimePeriod.bind(this, 4)}>
              <Text style={[styles.timePeriodToggle, {color: this.state.timePeriod === 4 ? 'red' : 'black'}]}>All Time</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
