import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import GridItem from './GridItem'

export default class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: []
    };

    this.fetchGrid = this.fetchGrid.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount() {
    this.fetchGrid()
  }

  fetchGrid() {
    fetch(global.API_URL + '/api/grid', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({grid: data})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  renderItem(item) {
    return (
      <GridItem {...item.item} navigation={this.props.navigation} />
    )
  }

  render() {
    if (this.state.grid.length > 0) {
      return (
        <ScrollView>
          <FlatList
            data={this.state.grid}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}
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
  
})
