import React from 'react';
import { ScrollView, View, SafeAreaView, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { setLine } from './grid.operations'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'

class GridChooseModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };

    this.selectItem = this.selectItem.bind(this)
  }

  selectItem(index) {
    this.setState({showModal: false})
    this.props.setLineIndex(index)
  }

  render() {
    const win = Dimensions.get('window');

    var renderedItems = []
    if (this.props.lines.length > 0) {
      renderedItems = this.props.lines.map((item, index) => {
        return (
          <TouchableOpacity onPress={this.selectItem.bind(this, index)} key={index}>
            <Text style={[styles.timePeriodToggle, {color: this.props.lineIndex === index ? '#FF8300' : 'black'}]}>{item.name}</Text>
          </TouchableOpacity>
        )
      })

      return (
        <View>
          <TouchableOpacity onPress={() => this.setState({ showModal: true })}>
            <View style={{backgroundColor: '#FF8300', borderRadius: 4, marginRight: 10}}>
              <Text style={{fontSize: 14, paddingVertical: 6, paddingHorizontal: 8, color: 'white'}}>CHOOSE</Text>
            </View>
          </TouchableOpacity>
          <Modal
            isVisible={this.state.showModal}
            onBackdropPress={() => this.setState({ showModal: false })}
            style={{justifyContent: 'center', alignItems: 'center'}}
          >
            {this.props.scroll ?
            <View style={{height: win.height - 300}}>
              <ScrollView
                style={{width: win.width - 100, backgroundColor: 'white', borderRadius: 8}}
                contentContainerStyle={{flex: 0}}
              >
                {renderedItems}
              </ScrollView>
            </View>
            :
            <View style={{width: win.width - 100, backgroundColor: 'white', borderRadius: 8}}>
              {renderedItems}
            </View>
            }
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

function mapStateToProps(state) {
  return {
    lines: state.splash.lines,
    lineIndex: state.grid.lineIndex
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLineIndex: (index) => dispatch(setLine(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GridChooseModal);
