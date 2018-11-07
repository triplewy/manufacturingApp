import React from 'react';
import {ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal'

export default class ChooseModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: this.props.defaultIndex ? this.props.defaultIndex : 0,
      showModal: false
    };

    this.selectItem = this.selectItem.bind(this)
  }

  selectItem(index) {
    this.setState({showModal: false, selectedItem: index})
    this.props.selectItem(index)
  }

  render() {
    const win = Dimensions.get('window');

    var renderedItems = []
    if (this.props.items.length > 0) {
      renderedItems = this.props.items.map((item, index) => {
        return (
          <TouchableOpacity onPress={this.selectItem.bind(this, index)} key={index}>
            <Text style={[styles.timePeriodToggle, {color: this.state.selectedItem === index ? '#FF8300' : 'black'}]}>{item.name}</Text>
          </TouchableOpacity>
        )
      })

      return (
        <View style={{marginVertical: 30, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.timePeriodTitle}>{this.props.items[this.state.selectedItem].name}</Text>
          <TouchableOpacity onPress={() => this.setState({ showModal: true })}>
            <View style={{backgroundColor: '#FF8300', borderRadius: 8}}>
              <Text style={{fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: 'white'}}>Choose</Text>
            </View>
          </TouchableOpacity>
          <Modal
            isVisible={this.state.showModal}
            onBackdropPress={() => this.setState({ showModal: false })}
            style={{justifyContent: 'center', alignItems: 'center'}}
          >
            <View style={{width: win.width - 100, backgroundColor: 'white', borderRadius: 8}}>
              {renderedItems}
            </View>
          </Modal>
        </View>
      )
    } else {
      return (
        null
      )
    }
  }
}

const styles = StyleSheet.create({
  timePeriodTitle: {
    flex: 1,
    fontSize: 18,
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
