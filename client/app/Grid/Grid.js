import React from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList, Platform } from 'react-native';
import { connect } from 'react-redux'
import { fetchGrid, fetchLines, setLine } from './grid.operations'
import { parseTimer } from '../ParseTime'
import PushNotification from '../PushNotification/PushNotification'
import GridItem from './GridItem'
import GridChooseModal from './GridChooseModal'
import ChooseModal from '../ChooseModal'

class Grid extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params
    if (params) {
      return {
        headerTitle: params.title,
        headerRight: <GridChooseModal />
      }
    } else {
      return {
        headerTitle: 'Inputs',
      }
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      currentTime: Date.now()
    }

    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.props.lines[this.props.lineIndex].name,
      lines: this.props.lines,
      lineIndex: this.props.lineIndex,
      setLineIndex: this.props.setLineIndex
    })
    if (this.props.expire) {
      this.setState({ currentTime: Date.now() }, () => {
        this.interval = setInterval(() => {
          if (this.state.currentTime >= this.props.expire) {
            clearInterval(this.interval)
          } else {
            this.setState({ currentTime: Date.now() })
          }
        }, 1000)
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.expire && this.props.expire) {
      this.setState({ currentTime: Date.now() }, () => {
        this.interval = setInterval(() => {
          if (this.state.currentTime >= this.props.expire) {
            clearInterval(this.interval)
          } else {
            this.setState({ currentTime: Date.now() })
          }
        }, 1000)
      })
    }

    if (this.props.lineIndex !== prevProps.lineIndex) {
      this.props.navigation.setParams({
        title: this.props.lines[this.props.lineIndex].name,
        lines: this.props.lines,
        lineIndex: this.props.lineIndex,
        setLineIndex: this.props.setLineIndex
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  renderItem(item) {
    return (
      <GridItem {...item.item} navigation={this.props.navigation} />
    )
  }

  render() {
    const expire = this.props.expire
    const isActiveLine = this.props.activeLine === this.props.lines[this.props.lineIndex].lineId
    var columns = 4
    if (!Platform.isPad) {
      columns = 3
    }
    return (
      <View>
        <PushNotification />
        <View style={[styles.expire, {maxHeight: isActiveLine ? 80 : 0 }]}>
          <Text style={styles.expireText}>{isActiveLine ? parseTimer(expire, this.state.currentTime) : ''}</Text>
        </View>
        <ScrollView>
          <View style={styles.statsView}>
            {this.props.lines.length > 0 ?
              <FlatList
                data={this.props.machines[this.props.lines[this.props.lineIndex].lineId]}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={columns}
                contentContainerStyle={{alignItems: 'center'}}
              />
              :
              null
            }
          </View>
        </ScrollView>
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

  },
  icon: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 5
  },
  expire: {
    backgroundColor: '#FF8300',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  expireText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 10
  }
})

function mapStateToProps(state) {
  return {
    lines: state.splash.lines,
    machines: state.splash.machines,
    ...state.grid
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGrid: (lineId) => dispatch(fetchGrid(lineId)),
    setLineIndex: (index) => dispatch(setLine(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
