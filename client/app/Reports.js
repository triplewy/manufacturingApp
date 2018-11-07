import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';
import ReportItem from './ReportItem'
import ChooseModal from './ChooseModal'
import Modal from 'react-native-modal'

export default class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      lines: [{name: 'ALL LINES'}],
      refreshing: false,
    };

    this.fetchReports = this.fetchReports.bind(this)
    this.fetchLines = this.fetchLines.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchReports()
    this.fetchLines()
  }

  fetchReports(index) {
    var url = global.API_URL + '/api/reports'
    if (index) {
      url += '/line/' + this.state.lines[index].lineId
    }

    this.setState({refreshing: true})
    fetch(url, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      this.setState({reports: data, refreshing: false})
    })
    .catch((error) => {
      console.error(error);
    });
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

  renderItem(item) {
    return (
      <ReportItem {...item.item} navigation={this.props.navigation} />
    )
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.fetchReports.bind(this)}
          />
        }
      >
        <ChooseModal items={this.state.lines} selectItem={this.fetchReports} />
        {this.state.reports.length > 0 ?
          <FlatList
            data={this.state.reports}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.downtimeId.toString()}
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
    fontSize: 24,
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
