import React from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions, Animated, Easing} from 'react-native';
import { fetchDowntimeStats } from './downtimeStats.operations'
import { connect } from 'react-redux'
import { parseTime } from '../../ParseTime.js'
import { downtimeString } from '../../DowntimeString.js'

class DowntimeStatsVertical extends React.Component {
  constructor(props) {
    super(props);

    this.fadeValue = new Animated.Value(0)

    this.fadeIn = this.fadeIn.bind(this)
    this.fadeOut = this.fadeOut.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    if (this.props.lines.length > 0) {
      this.props.getDowntimeStats(this.props.lines[this.props.lineIndex].lineId, this.props.timePeriod)
      this.fadeIn()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.lineIndex !== prevProps.lineIndex || this.props.timePeriod !== prevProps.timePeriod) {
      if (this.props.lines.length > 0) {
        this.props.getDowntimeStats(this.props.lines[this.props.lineIndex].lineId, this.props.timePeriod)
      }
    }
  }

  fadeIn() {
    Animated.timing(
      this.fadeValue,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.ease
      }
    ).start(() => this.fadeOut())
  }

  fadeOut() {
    Animated.timing(
      this.fadeValue,
      {
        toValue: 0,
        duration: 2000,
        easing: Easing.ease
      }
    ).start(() => this.fadeIn())
  }

  renderItem(item) {
    const win = Dimensions.get('window');
    const currDate = parseTime(this.props.timePeriod, item.item.time)
    var availableMin = item.item.availableMin
    var downtime = 0
    if (item.item.downtime) {
      downtime = item.item.downtime
    }
    const height = downtime / availableMin * 400
    const parsedDowntime = downtimeString(downtime)
    if (downtime !== 0) {
      return (
        <View style={{marginBottom: 20, alignItems: 'center', justifyContent: 'center', width: 80}}>
          <View style={{flex:1}} />
          <View style={{marginBottom: 5}}>
            <Text style={{color: 'gray', textAlign: 'center'}}>{parsedDowntime}</Text>
          </View>
          {this.props.timePeriod > 0 && this.props.timePeriod < 3  ?
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DayStats', {
              date: item.item.time,
              downtime: downtime,
              availableMin: item.item.availableMin
            })}>
              <View style={{height: height, width: 70, backgroundColor: '#FF8300', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                <Animated.View style={{opacity: this.fadeValue}}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>{Math.round(downtime / availableMin * 100) + '%'}</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
            :
            <View>
              <View style={{height: height, width: 70, backgroundColor: '#FF8300', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
                <View>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>{Math.round(downtime / availableMin * 100) + '%'}</Text>
                </View>
              </View>
            </View>
          }

          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'gray', marginTop: 10}}>{item.item.dateLabel}</Text>
          </View>
        </View>
      )
    } else {
      return null
    }

  }

  render() {
    const win = Dimensions.get('window');
    return (
      <View style={styles.statsView}>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <Text style={{color: 'gray', fontSize: 18, flex: 1}}>Downtime</Text>
          <Text style={{color: '#73C9D0', fontSize: 18, fontWeight: 'bold'}}>{`Average: ${Math.round(this.props.average ? this.props.average * 100 : 0)}%`}</Text>
        </View>
        <FlatList
          horizontal
          scrollEnabled
          data={this.props.downtime}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingVertical: 10}}
        />
        <View style={[styles.averageLine, {bottom: 75 + this.props.average * 400, width: win.width}]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  statsView: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 40,
    height: 600,
  },
  averageLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#73C9D0',
    zIndex: 10,
  }
})

function mapStateToProps(state) {
  return {
    timePeriod: state.stats.timePeriod,
    lineIndex: state.stats.lineIndex,
    lines: state.splash.lines,
    downtime: state.downtimeStats.downtime,
    totalDowntime: state.downtimeStats.totalDowntime,
    average: state.downtimeStats.average
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getDowntimeStats: (lineId, timePeriod) => dispatch(fetchDowntimeStats(lineId, timePeriod))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DowntimeStatsVertical);
