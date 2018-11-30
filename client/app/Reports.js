import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
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

      scrolled: false,
      refreshing: false,
      updating: false,
      finished: false
    };

    this.fetchReports = this.fetchReports.bind(this)
    this.updatePage = this.updatePage.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
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
      var finished = false
      if (data.length < 10) {
          finished = true
      }
      this.setState({reports: data, refreshing: false, finished: finished})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  updatePage() {
    if (!this.state.refreshing && !this.state.finished && !this.state.updating && this.state.scrolled && !this.onEndReachedCalledDuringMomentum) {
      this.setState({updating: true})

      var url = global.API_URL + '/api/reports'
      if (this.state.line) {
        url += '/line/' + this.state.lines[this.state.line].lineId
      }
      url += '/page=' + (this.state.page + 1)

      fetch(url, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        var finished = false
        if (data.length < 10) {
            finished = true
        }
        this.setState({reports: this.state.reports.concat(data), updating: false, page: this.state.page + 1, finished: finished})
        this.onEndReachedCalledDuringMomentum = true;
      })
      .catch((error) => {
        console.error(error);
      })
    }
  }

  renderItem(item) {
    return (
      <ReportItem {...item.item} navigation={this.props.navigation} />
    )
  }

  renderFooter() {
    return (
      <View style={{marginBottom: 80, paddingVertical: 10}}>
        <ActivityIndicator size="large" animating={this.state.updating} color="#FF8300" />
      </View>
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
            onScroll={() => {this.setState({scrolled: true})}}
            data={this.state.reports}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={this.fetchReports.bind(this)}
            refreshing={this.state.refreshing}
            onEndReached={this.updatePage.bind(this)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={this.renderFooter}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
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
