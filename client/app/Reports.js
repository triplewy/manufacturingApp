import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import ReportItem from './ReportItem'

export default class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      refreshing: false
    };

    this.fetchReports = this.fetchReports.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchReports()
  }

  fetchReports() {
    this.setState({refreshing: true})
    fetch(global.API_URL + '/api/reports', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({reports: data, refreshing: false})
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
    if (this.state.reports.length > 0) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.fetchReports.bind(this)}
            />
          }
        >
          <FlatList
            data={this.state.reports}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.downtimeId.toString()}
          />
        </ScrollView>
      )
    } else {
      return (
        <SafeAreaView style={{alignItems: 'center'}}>
          <Text>Loading</Text>
        </SafeAreaView>
      )
    }
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
})
