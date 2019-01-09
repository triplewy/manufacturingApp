import React from 'react';
import { Dimensions, FlatList, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { setShift } from '../Storage'
import { connect } from 'react-redux'

class Shifts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: -1
    };

    this.setShift = this.setShift.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  setShift() {
    setShift(this.props.shifts[this.state.index].minutes).then(result => {
      if (result === 'success') {
        this.props.navigation.navigate('Tabs')
      } else {
        console.log(result);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  renderItem(item) {
    return (
      <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.setState({ index: item.index })}>
        <Text style={{fontSize: 24, padding: 20, color: this.state.index === item.index ? '#FF8300' : 'gray'}}>{`${item.item.minutes / 60} HOURS`}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const win = Dimensions.get('window')
    return (
      <View style={{justifyContent: 'center', flex: 1, backgroundColor: '#FF8300'}}>
        <View style={styles.inputView}>
          <Text style={styles.title}>Shift</Text>
          <View style={{backgroundColor: 'white', height: win.height/2, width: win.width * 3 / 4, borderRadius: 8}}>
            <FlatList
              extraData={this.state.index}
              data={this.props.shifts}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <TouchableOpacity onPress={this.setShift} disabled={this.state.index < 0}>
            <View style={[styles.loginButton, {backgroundColor: this.state.index >= 0 ? '#83D3D6' : 'white'}]}>
              <Text style={[styles.loginButtonText, {color: this.state.index >= 0 ? 'white' : '#f1f1f1'}]}>Done</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const win = Dimensions.get('window');
const styles = StyleSheet.create({
  title: {
    color: '#888888',
    color: 'white',
    fontSize: 48,
    fontWeight: '600',
    marginBottom: 20
  },
  inputView: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    width: win.width - 100,
    borderBottomWidth: 5,
    borderColor: 'white',
    padding: 12,
    color: 'white',
    fontSize: 24,
    margin: 20
  },
  loginButton: {
    margin: 40,
    alignItems: 'center',
    width: 200,
    borderRadius: 24
  },
  loginButtonText: {
    padding: 15,
    fontSize: 18,
  }
})

function mapStateToProps(state) {
  return {
    ...state.shifts
  }
}

export default connect(mapStateToProps)(Shifts);
