import React from 'react';
import { ScrollView, View, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { fetchGrid, fetchLines, setLine } from './grid.operations'
import { connect } from 'react-redux'
import GridItem from './GridItem'
import ChooseModal from '../ChooseModal'

class Grid extends React.Component {

  componentDidMount() {
    this.props.getLines()
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
    lines: state.grid.lines,
    lineIndex: state.grid.lineIndex
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGrid: (lineId) => dispatch(fetchGrid(lineId)),
    getLines: () => dispatch(fetchLines()),
    setLineIndex: (index) => dispatch(setLine(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);

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
  }
})
