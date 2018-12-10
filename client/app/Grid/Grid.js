import React from 'react';
import { ScrollView, View,  FlatList, Platform } from 'react-native';
import { fetchGrid, fetchLines, setLine } from './grid.operations'
import { connect } from 'react-redux'
import GridItem from './GridItem'
import ChooseModal from '../ChooseModal'
import styles from "./grid.style";

class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.renderItem = this.renderItem.bind(this)
    this.setLine = this.setLine.bind(this)
  }

  componentDidMount() {
    this.props.getGrid(this.props.lines[this.props.lineIndex].lineId)
  }

  renderItem(item) {
    return (
      <GridItem {...item.item} navigation={this.props.navigation} />
    )
  }

  setLine(index) {
    this.props.setLineIndex(index).then(() => {
      this.props.getGrid(this.props.lines[this.props.lineIndex].lineId)
    })
  }

  render() {
    var columns = 4
    if (!Platform.isPad) {
      columns = 3
    }
    return (
      <ScrollView>
        <ChooseModal
          items={this.props.lines}
          index={this.props.lineIndex}
          selectItem={this.setLine}
        />
        <View style={styles.statsView}>
          <FlatList
            data={this.props.grid}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={columns}
            contentContainerStyle={{alignItems: 'center'}}
          />
        </View>
      </ScrollView>
    )
  }
}

function mapStateToProps(state) {
  return {
    grid: state.grid.data,
    lines: state.splash.lines,
    lineIndex: state.grid.lineIndex
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGrid: (lineId) => dispatch(fetchGrid(lineId)),
    setLineIndex: (index) => dispatch(setLine(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
