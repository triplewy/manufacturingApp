import React from 'react';
import {ScrollView, View, Image, RefreshControl, FlatList, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity} from 'react-native';
import plusIcon from './icons/plus-icon.png'

export default class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      downtime: null,
      description: '',
      progress: 0
    };

    this.handleDowntimeChange = this.handleDowntimeChange.bind(this)
    this.submut = this.submit.bind(this)
  }

  handleDowntimeChange(text) {
    this.setState({downtime: text.replace(/[^0-9]/g, '')});
  }

  submit() {
    var navigationProps = this.props.navigation.state.params
    fetch(global.API_URL + '/api/input/submit', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        machineId: navigationProps.machineId,
        downtime: this.state.downtime,
        description: this.state.description
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'success') {
        this.props.navigation.navigate('Grid')
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  render() {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var currDate = new Date().toLocaleDateString('en-US', options)
    return (
      <ScrollView>
        <View style={styles.inputView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lockedInputLabel}>Production Day:</Text>
            <Text style={styles.lockedText}>{currDate}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lockedInputLabel}>Line:</Text>
            <Text style={styles.lockedText}>1</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 18, color: '#888888'}}>Line Leader:</Text>
            <Text style={styles.lockedText}>Jon Pensler</Text>
          </View>
        </View>
        <View style={styles.inputView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.inputLabel}>Downtime:</Text>
            <TextInput keyboardType='numeric' style={{fontSize: 18, color: this.state.downtime ? 'black' : '#888888'}} placeholder='0' value={this.state.downtime} onChangeText={(text) => this.handleDowntimeChange(text)}/>
            <Text style={{marginLeft: 10, fontSize: 18, color: this.state.downtime ? 'black' : '#888888'}}>Minutes</Text>
          </View>
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputLabel}>Description:</Text>
          <TextInput multiline={true} numberOfLines={10} style={styles.textarea} value={this.state.description} onChangeText={(text) => this.setState({description: text})}/>
        </View>
        <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 20}}>Add photos to your description (Optional)</Text>
        <View style={styles.inputView}>
          <TouchableOpacity>
            <View style={styles.addButton}>
              <Image source={plusIcon} style={{width: 50, height: 50}}/>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.submit.bind(this)}>
          <View style={{backgroundColor: '#83D3D6', alignItems: 'center'}}>
            <Text style={styles.submitButton}>Submit</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 50
  },
  lockedInputLabel: {
    fontSize: 18,
    marginBottom: 20,
    color: '#888888'
  },
  inputLabel: {
    flex: 1,
    fontSize: 18,
    marginBottom: 20
  },
  lockedText: {
    fontSize: 18,
    color: '#888888',
    marginLeft: 'auto'
  },
  input: {
    fontSize: 18
  },
  textarea: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    fontSize: 18,
    borderRadius: 4,
    height: 200
  },
  addButton: {
    height: 100,
    width: 100,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButton: {
    color: 'white',
    paddingVertical: 20,
    fontSize: 18
  }
})
