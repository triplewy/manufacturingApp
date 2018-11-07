import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity, Platform} from 'react-native';
import GridItem from './GridItem'
import ChooseModal from './ChooseModal'
import { getCookie } from './Storage'

export default class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: [],
      lines: [],
    };

    this.fetchGrid = this.fetchGrid.bind(this)
    this.fetchLines = this.fetchLines.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchGrid()
    this.fetchLines()
  }

  fetchGrid(index) {
    var url = global.API_URL + '/api/grid'
    if (index) {
      url += '/line/' + this.state.lines[index].lineId
    }

    fetch(url, {credentials: 'include'})
    .then(res => res.json())
    .then(data => {
      this.setState({grid: data})
    })
    .catch((error) => {
      console.error(error);
    })
  }

  fetchLines() {
    fetch(global.API_URL + '/api/account/lines', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      var lines = []
      for (var i = 0; i < data.length; i++) {
        lines.push({name: 'LINE ' + data[i].lineId, lineId: data[i].lineId})
      }
      this.setState({lines: lines})
    })
    .catch((error) => {
      console.error(error);
    })
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
        <ChooseModal items={this.state.lines} selectItem={this.fetchGrid} />
        <View style={styles.statsView}>
          {this.state.grid.length > 0 ?
            <FlatList
              data={this.state.grid}
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
