import React from 'react';
import { View, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { fetchLines } from './fetchLines.js'
import { NavigationEvents } from 'react-navigation';
import ReportItem from './ReportItem'
import ChooseModal from './ChooseModal'
import CalendarModal from './CalendarModal'
import Modal from 'react-native-modal'

export default class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.heightValue = new Animated.Value(80)
    this.state = {
      reports: [],
      lines: [],
      line: 0,
      page: 0,

      machines: [],
      machine: 0,

      date: '',

      scrolled: false,
      refreshing: false,
      updating: false,
      finished: false,

      viewOptions: false
    };

    this.toggleViewOptions = this.toggleViewOptions.bind(this)

    this.fetchReports = this.fetchReports.bind(this)
    this.fetchMachines = this.fetchMachines.bind(this)

    this.setLine = this.setLine.bind(this)
    this.setMachine = this.setMachine.bind(this)
    this.setDate = this.setDate.bind(this)

    this.updatePage = this.updatePage.bind(this)
    this.handleNavigate = this.handleNavigate.bind(this)

    this.renderItem = this.renderItem.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
  }

  componentDidMount() {
    fetchLines().then(data => {
      this.setState({lines: data}, () => {
        this.fetchReports()
        this.fetchMachines()
      })
    })
  }

  toggleViewOptions() {
    this.setState({viewOptions: !this.state.viewOptions}, () => {
      Animated.timing(
        this.heightValue,
        {
          toValue: this.state.viewOptions ? 400 : 80,
          duration: 500
        }
      ).start()
    })
  }

  fetchReports() {
    var url = global.API_URL
    if (this.state.machine !== 0) {
      url += '/api/reports/machine=' + this.state.machines[this.state.machine].machineId
    } else {
      url += '/api/reports/line/' + this.state.lines[this.state.line].lineId
    }

    if (this.state.date) {
      url += '/date=' + this.state.date
    }

    url += '/page=' + this.state.page

    this.setState({refreshing: true}, () => {
      fetch(url, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        this.setState({reports: data, refreshing: false, finished: data.length < 10})
      })
      .catch((error) => {
        console.error(error);
      })
    })
  }

  fetchMachines() {
    fetch(global.API_URL + '/api/account/line=' + this.state.lines[this.state.line].lineId + '/machines', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      this.setState({machines: [{name: 'ALL MACHINES'}].concat(data)})
    })
    .catch((error) => {
      console.error(error);
    })
  }

  setLine(index) {
    this.setState({line: index, machine: 0, page: 0, reports: []}, () => {
      this.fetchMachines()
      this.fetchReports()
    })
  }

  setMachine(index) {
    this.setState({machine: index, page: 0, reports: []}, () => {
      this.fetchReports()
    })
  }

  setDate(day) {
    this.setState({date: day, page: 0, reports: []}, () => {
      this.fetchReports()
    })
  }

  updatePage() {
    if (!this.state.refreshing && !this.state.finished && !this.state.updating && this.state.scrolled && !this.onEndReachedCalledDuringMomentum) {
      this.setState({page: this.state.page + 1, updating: true}, () => {
        var url = global.API_URL
        if (this.state.machine !== 0) {
          url += '/api/reports/machine=' + this.state.machines[this.state.machine].machineId
        } else {
          url += '/api/reports/line/' + this.state.lines[this.state.line].lineId
        }
        url += '/page=' + this.state.page
        fetch(url, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          this.setState({reports: this.state.reports.concat(data), updating: false, finished: data.length < 10})
          this.onEndReachedCalledDuringMomentum = true;
        })
        .catch((error) => {
          console.error(error);
        })
      })
    }
  }

  handleNavigate(payload) {
    if (payload.action.params) {
      const lineId = payload.action.params.lineId
      const machineId = payload.action.params.machineId
      const date = payload.action.params.date

      if (this.state.lines.length > 0) {
        for (var i = 0; i < this.state.lines.length; i++) {
          if (this.state.lines[i].lineId === lineId) {
            this.setState({line: i, date: date.substring(0, date.indexOf('T')), machine: 0, page: 0, reports: []}, () => {
              this.fetchMachines()
              this.fetchReports()
            })
            break;
          }
        }
      } else {
        fetchLines().then(data => {
          this.setState({lines: data}, () => {
            for (var i = 0; i < this.state.lines.length; i++) {
              if (this.state.lines[i].lineId === lineId) {
                this.setState({line: i, date: date.substring(0, date.indexOf('T')), machine: 0, page: 0, reports: []}, () => {
                  this.fetchMachines()
                  this.fetchReports()
                })
                break;
              }
            }
          })
        })
      }
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
        <NavigationEvents
          onDidFocus={payload => this.handleNavigate(payload)}
        />
        <Animated.View style={{maxHeight: this.heightValue, overflow: 'hidden', paddingBottom: 20}}>
          <TouchableOpacity onPress={() => this.toggleViewOptions()}>
            <View style={{flexDirection: 'row', height: 80, paddingHorizontal: 20, alignItems: 'center'}}>
              <Text style={{fontSize: 21, flex: 1}}>OPTIONS</Text>
              <Text style={{fontSize: 21}}>{this.state.viewOptions ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
          <ChooseModal
            items={this.state.lines}
            index={this.state.line}
            selectItem={this.setLine}
          />
          <ChooseModal
            items={this.state.machines}
            index={this.state.machine}
            selectItem={this.setMachine}
            scroll
          />
          <CalendarModal
            date={this.state.date}
            selectDate={this.setDate}
          />
        </Animated.View>
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
