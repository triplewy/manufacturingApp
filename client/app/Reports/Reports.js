import React from 'react';
import { View, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { handleReports, handleUpdateReports, setPage, setDate, setLine, setMachine, setName } from './reports.operations'
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux'
import ReportItem from './ReportItem'
import ChooseModal from '../ChooseModal'
import CalendarModal from '../CalendarModal'
import Modal from 'react-native-modal'

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.heightValue = new Animated.Value(80)
    this.state = {
      scrolled: false,
      viewOptions: false
    };

    this.toggleViewOptions = this.toggleViewOptions.bind(this)
    this.fetchReports = this.fetchReports.bind(this)
    this.updatePage = this.updatePage.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
  }

  componentDidMount() {
    this.fetchReports()
  }

  componentDidUpdate(prevProps) {
    if (this.props.lineIndex !== prevProps.lineIndex || this.props.machineIndex !== prevProps.machineIndex || this.props.date !== prevProps.date) {
      this.fetchReports()
    }
  }

  toggleViewOptions() {
    this.setState({viewOptions: !this.state.viewOptions}, () => {
      Animated.timing(
        this.heightValue,
        {
          toValue: this.state.viewOptions ? 420 : 80,
          duration: 500
        }
      ).start()
    })
  }

  fetchReports() {
    if (this.props.lines.length > 0) {
      const lineId = this.props.lines[this.props.lineIndex].lineId
      this.props.getReports(lineId, this.props.machineIndex ? this.props.machines[lineId][this.props.machineIndex - 1].machineId : 0, this.props.date)
    }
  }

  updatePage() {
    if (!this.props.finished && !this.onEndReachedCalledDuringMomentum && this.state.scrolled) {
      this.props.updatePage(this.props.page + 1).then(() => {
        const lineId = this.props.lines[this.props.lineIndex].lineId
        this.props.updateReports(lineId, this.props.machineIndex ? this.props.machines[lineId][this.props.machineIndex - 1].machineId : 0, this.props.date, this.props.page)
        this.onEndReachedCalledDuringMomentum = true;
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
        <ActivityIndicator size="large" animating={this.props.updating} color="#FF8300" />
      </View>
    )
  }

  render() {
    return (
      <View>
        <Animated.View style={{maxHeight: this.heightValue, overflow: 'hidden', paddingBottom: 20}}>
          <TouchableOpacity onPress={() => this.toggleViewOptions()}>
            <View style={{flexDirection: 'row', height: 80, paddingHorizontal: 20, alignItems: 'center'}}>
              <Text style={{fontSize: 21, flex: 1}}>OPTIONS</Text>
              <Text style={{fontSize: 21}}>{this.state.viewOptions ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
          <ChooseModal
            items={this.props.lines}
            index={this.props.lineIndex}
            selectItem={this.props.setLineIndex}
          />
          {this.props.lines.length > 0 ?
            <ChooseModal
              items={[{name: 'ALL MACHINES'}].concat(this.props.machines[this.props.lines[this.props.lineIndex].lineId])}
              index={this.props.machineIndex}
              selectItem={this.props.setMachineIndex}
              scroll
            />
            :
            null
          }
          {/* <ChooseModal
            items={[{name: 'ALL WORKERS'}].concat(this.props.names)}
            index={this.props.nameIndex}
            selectItem={this.props.setNameIndex}
          /> */}
          <CalendarModal
            date={this.props.date}
            selectDate={this.props.updateDate}
          />
        </Animated.View>
        <FlatList
          onScroll={() => {this.setState({scrolled: true})}}
          data={this.props.reports}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          onRefresh={this.fetchReports}
          refreshing={this.props.refreshing}
          onEndReached={this.updatePage}
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

function mapStateToProps(state) {
  return {
    lines: state.splash.lines,
    machines: state.splash.machines,
    lineIndex: state.reports.lineIndex,
    machineIndex: state.reports.machineIndex,
    names: state.splash.names,
    nameIndex: state.reports.nameIndex,
    reports: state.reports.reports,
    page: state.reports.page,
    date: state.reports.date,
    refreshing: state.reports.refreshing,
    updating: state.reports.updating,
    finished: state.reports.finished
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getReports: (lineId, machineId, date) => dispatch(handleReports(lineId, machineId, date)),
    updatePage: (page) => dispatch(setPage(page)),
    updateReports: (lineId, machineId, date, page) => dispatch(handleUpdateReports(lineId, machineId, date, page)),
    setLineIndex: (index) => dispatch(setLine(index)),
    setMachineIndex: (index) => dispatch(setMachine(index)),
    setNameIndex: (index) => dispatch(setName(index)),
    updateDate: (date) => dispatch(setDate(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
