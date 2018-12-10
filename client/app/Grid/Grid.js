import React from 'react';
import { ScrollView, View, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { fetchGrid, fetchLines, setLine } from './grid.operations'
// import { fetchLines } from '../fetchLines.js'
import { connect } from 'react-redux'
import GridItem from './GridItem'
import ChooseModal from '../ChooseModal'

// export default class Grid extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       grid: [],
//       lines: [],
//       line: 0
//     };
//
//     this.fetchGrid = this.fetchGrid.bind(this)
//     this.setLine = this.setLine.bind(this)
//     this.renderItem = this.renderItem.bind(this)
//   }
//
//   componentDidMount() {
//     fetchLines().then(data => {
//       this.setState({lines: data}, () => {
//         this.fetchGrid()
//       })
//     })
//   }
//
//   fetchGrid() {
//     fetch(global.API_URL + '/api/grid/line/' + this.state.lines[this.state.line].lineId, {credentials: 'include'})
//     .then(res => res.json())
//     .then(data => {
//       this.setState({grid: data})
//     })
//     .catch((error) => {
//       console.error(error);
//     })
//   }
//
//   setLine(index) {
//     this.setState({line: index}, () => {
//       this.fetchGrid()
//     })
//   }
//
//   renderItem(item) {
//     return (
//       <GridItem {...item.item} navigation={this.props.navigation} />
//     )
//   }
//
//   render() {
//     var columns = 4
//     if (!Platform.isPad) {
//       columns = 3
//     }
//     return (
//       <ScrollView>
//         <ChooseModal
//           items={this.state.lines}
//           index={this.state.line}
//           selectItem={this.setLine}
//         />
//         <View style={styles.statsView}>
//           <FlatList
//             data={this.state.grid}
//             renderItem={this.renderItem}
//             keyExtractor={(item, index) => index.toString()}
//             numColumns={columns}
//             contentContainerStyle={{alignItems: 'center'}}
//           />
//         </View>
//       </ScrollView>
//     )
//   }
// }


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
