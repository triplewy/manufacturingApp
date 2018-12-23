import React from 'react';
import { Dimensions, FlatList, View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { setName } from './name.operations'
import { connect } from 'react-redux'
import { setNameStorage } from '../Storage'

class Name extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.postName = this.postName.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  postName(e) {
    setNameStorage(this.props.nameIndex.toString()).then(data => {
      if (data.message === 'success') {
        this.props.navigation.navigate('Tabs')
      } else {
        console.log(data);
      }
    })
  }

  renderItem(item) {
    return (
      <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.props.setNameIndex(item.index)}>
        <Text style={{fontSize: 24, padding: 20, color: this.props.nameIndex === item.index ? '#FF8300' : 'gray'}}>{item.item.name}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const win = Dimensions.get('window')
    return (
      <View style={{justifyContent: 'center', flex: 1, backgroundColor: '#FF8300'}}>
        <View style={styles.inputView}>
          <Text style={styles.title}>Name</Text>
          <View style={{backgroundColor: 'white', height: win.height/2, width: win.width * 3 / 4, borderRadius: 8}}>
            <FlatList
              key={this.props.nameIndex}
              data={this.props.names}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <TouchableOpacity onPress={this.postName} disabled={this.props.nameIndex < 0}>
            <View style={[styles.loginButton, {backgroundColor: this.props.nameIndex >= 0 ? '#83D3D6' : 'white'}]}>
              <Text style={[styles.loginButtonText, {color: this.props.nameIndex >= 0 ? 'white' : '#f1f1f1'}]}>Done</Text>
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
    names: state.splash.names,
    nameIndex: state.name.nameIndex
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setNameIndex: (index) => dispatch(setName(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Name);
