import React from 'react';
import { ScrollView, FlatList, View, TextInput, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { lineIndex, machineIndex, handleDescription, handleRating, submit  } from './workOrder.operations'
import { Rating, AirbnbRating } from 'react-native-ratings'
import { connect } from 'react-redux'
import ChooseModal from '../ChooseModal'
import AddImages from '../AddImages/AddImages'

class WorkOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(lineId, machineId, rating, description, images) {
    this.props.handleSubmit(lineId, machineId, rating, description, images).then(() => {
      this.props.navigation.goBack()
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <ScrollView>
        <View style={{backgroundColor: 'white', marginBottom: 40}}>
          <ChooseModal
            items={this.props.lines}
            index={this.props.lineIndex}
            selectItem={this.props.setLineIndex}
          />
          <ChooseModal
            items={this.props.machines[this.props.lines[this.props.lineIndex].lineId]}
            index={this.props.machineIndex}
            selectItem={this.props.setMachineIndex}
            scroll
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputLabel}>Importance:</Text>
          <AirbnbRating
            type='custom'
            ratingColor='#FF8300'
            ratingBackgroundColor='#FF8300'
            onFinishRating={(rating) => this.props.setRating(rating)}
            count={5}
            reviews={["Low", "Not Urgent", "Moderate", "Important", "Urgent"]}
            defaultRating={3}
            size={40}
          />
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputLabel}>Description:</Text>
          <TextInput
            multiline={true}
            numberOfLines={10}
            placeholder='Type description of work order here...'
            style={[styles.textarea, {borderColor: this.props.description ? '#83D3D6' : '#FF8300'}]}
            value={this.props.description}
            onChangeText={(text) => this.props.setDescription(text)}
          />
        </View>
        <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 30, paddingHorizontal: 20}}>Add photos to your work order (Max 4 photos)</Text>
        <AddImages />
        <TouchableOpacity
          onPress={() => this.handleSubmit(
            this.props.lines[this.props.lineIndex].lineId,
            this.props.machines[this.props.lines[this.props.lineIndex].lineId][this.props.machineIndex].machineId,
            this.props.rating,
            this.props.description,
            this.props.images
          )}
          disabled={!(this.props.description) || this.props.submitted}
        >
          <View style={{backgroundColor: this.props.description ? '#83D3D6' : '#f1f1f1', alignItems: 'center', justifyContent: 'center', height: 80}}>
            {this.props.submitted ?
              <ActivityIndicator size="large" color="white" />
              :
              <Text style={styles.submitButton}>Submit</Text>
            }
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
  inputLabel: {
    flex: 1,
    fontSize: 18,
  },
  textarea: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    marginTop: 12,
    padding: 12,
    fontSize: 18,
    borderRadius: 4,
    height: 200
  },
  submitButton: {
    color: 'white',
    fontSize: 18
  },
})

function mapStateToProps(state) {
  return {
    ...state.splash,
    ...state.workOrder,
    ...state.addImages
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLineIndex: (index) => dispatch(lineIndex(index)),
    setMachineIndex: (index) => dispatch(machineIndex(index)),
    setDescription: (description) => dispatch(handleDescription(description)),
    setRating: (rating) => dispatch(handleRating(rating)),
    handleSubmit: (lineId, machineId, rating, description, images) => dispatch(submit(lineId, machineId, rating, description, images))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkOrder);
