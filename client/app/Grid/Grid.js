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
  }

  renderItem(item) {
    return (
      <GridItem {...item.item} navigation={this.props.navigation} />
    )
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
          selectItem={this.props.setLineIndex}
        />
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
    )
  }
}

function mapStateToProps(state) {
  return {
    grid: state.grid.data,
    lines: state.splash.lines,
    machines: state.splash.machines,
    lineIndex: state.grid.lineIndex,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGrid: (lineId) => dispatch(fetchGrid(lineId)),
    setLineIndex: (index) => dispatch(setLine(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
