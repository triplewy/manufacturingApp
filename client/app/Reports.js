import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';
import ReportItem from './ReportItem'
import ChooseModal from './ChooseModal'
import Modal from 'react-native-modal'
import { fetchLines } from './fetchLines.js'

export default class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      lines: [{name: 'ALL LINES'}],
      line: 0,
      page: 0,
      refreshing: false,
    };

    this.fetchReports = this.fetchReports.bind(this)
    this.updatePage = this.updatePage.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchReports()
    fetchLines().then(data => {
      this.setState({lines: this.state.lines.concat(data)})
    })
  }

  fetchReports(index) {
    var url = global.API_URL + '/api/reports'
    if (index) {
      this.setState({line: index, page: 0, reports: []})
      url += '/line/' + this.state.lines[index].lineId + '/page=0'
    } else {
      url += '/page=' + this.state.page
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

  updatePage() {
    var url = global.API_URL + '/api/reports'
    if (this.state.line) {
      url += '/line/' + this.state.lines[this.state.line].lineId
    }
    url += '/page=' + (this.state.page + 1)

    this.setState({refreshing: true})
    fetch(url, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      this.setState({reports: data.concat(data), refreshing: false, page: this.state.page + 1})
    })
    .catch((error) => {
      console.error(error);
    });

  }

  renderItem(item) {
    return (
      <ReportItem {...item.item} navigation={this.props.navigation} />
    )
  }

  render() {
    return (
      <View>
        <ChooseModal
          items={this.state.lines}
          selectItem={this.fetchReports}
          setLine={this.setLine}
        />
        {this.state.reports.length > 0 ?
          <FlatList
            data={this.state.reports}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.downtimeId.toString()}
            onRefresh={this.fetchReports.bind(this)}
            refreshing={this.state.refreshing}
            onEndReached={this.updatePage.bind(this)}
            onEndReachedThreshold={0.5}
          />
        :
          null
        }
      </View>
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
