import React from 'react';
import { ScrollView, View, Image, ImageBackground, FlatList, StyleSheet, Text, TextInput, Alert, ActivityIndicator, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux'
import { handleDowntime, handleDescription, handleAddImage, handleDeleteImage, handleUpload } from './input.operations'
import { insertActiveLine, removeActiveLine, setActiveMachine, notifyMechanic } from '../Grid/grid.operations'
import { parseTimer } from '../ParseTime'
import { getShift } from '../Storage'
import plusIcon from '../icons/plus-icon.png'
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import deleteIcon from '../icons/delete-icon.png'
import ImageModal from '../ImageModal'

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableMin: 0,
      images: [],
      showModal: false,
      selectedImage: null,
      currentTime: Date.now()
    }

    this.addImage = this.addImage.bind(this)
    this.deleteImage = this.deleteImage.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  componentDidMount() {
    const lineId = this.props.navigation.state.params.lineId
    const machineId = this.props.navigation.state.params.machineId

    if (machineId !== this.props.activeMachine) {
      this.props.setActiveLine(lineId, machineId).then(() => {
        this.interval = setInterval(() => {
          if (this.state.currentTime >= this.props.expire) {
            clearInterval(this.interval)
          } else {
            this.setState({ currentTime: Date.now() })
          }
        }, 1000)
      }).catch(err => {
        console.log(err);
      })
    } else {
      this.interval = setInterval(() => {
        if (this.state.currentTime >= this.props.expire) {
          clearInterval(this.interval)
        } else {
          this.setState({ currentTime: Date.now() })
        }
      }, 1000)
    }

    getShift().then(data => {
      this.setState({ availableMin: parseInt(data, 10) })
    }).catch(err => {
      console.log(err);
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  addImage() {
     if (this.state.images.length > 5) {
       Alert.alert(
         'Exceeded photos limit',
         'Max 6 photos',
         [
           {text: 'OK', onPress: () => console.log('OK Pressed')},
         ],
         { cancelable: false }
       )
     } else {
       ImagePicker.showImagePicker(null, (response) => {
         if (response.didCancel) {
           console.log('User cancelled image picker');
         } else if (response.error) {
           console.log('ImagePicker Error: ', response.error);
         } else if (response.customButton) {
           console.log('User tapped custom button: ', response.customButton);
         } else {
           ImageResizer.createResizedImage(response.uri, 1080, 1080 * 4 / 3, 'JPEG', 75).then((response) => {
             // response.uri is the URI of the new image that can now be displayed, uploaded...
             // response.path is the path of the new image
             // response.name is the name of the new image with the extension
             // response.size is the size of the new image
             const source = { uri: response.uri };
             this.setState({images: this.state.images.concat(source)})
           }).catch((err) => {
             console.log(err)
           })
         }
       })
     }
   }

   deleteImage(index) {
     var temp = this.state.images
     temp.splice(index, 1)
     this.setState({images: temp})
   }

  renderItem(item) {
    return (
      <TouchableOpacity onPress={() => this.setState({selectedImage: item.item.uri, showModal: true})}>
        <ImageBackground
          source={{uri: item.item.uri}}
          style={{width: 100, height: 100, margin: 20}}
          imageStyle={{borderRadius: 8}}
        >
          <TouchableOpacity onPress={() => this.deleteImage(item.index)}>
            <Image
              source={deleteIcon}
              style={{position: 'absolute', width: 40, height: 40, right: -20, top: -20}}
            />
          </TouchableOpacity>
        </ImageBackground>
      </TouchableOpacity>
    )
  }

  toggleModal() {
    this.setState({showModal: !this.state.showModal})
  }

  render() {
    var options = { weekday: 'long', month: 'short', day: 'numeric' };
    var currDate = new Date().toLocaleDateString('en-US', options)
    const expire = this.props.expire
    return (
      <ScrollView>
        <View style={{alignItems: 'center', justifyContent: 'center', margin: 20}}>
          <View style={{backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 3, borderColor: expire ? '#FF8300' : 'white'}}>
            <Image
              source={{uri: this.props.navigation.state.params.icon_url}}
              style={{width: 80, height: 80}}
            />
          </View>
          <Text style={[styles.inputLabel, {color: '#FF8300', fontWeight: 'bold', marginTop: 10}]}>
            {expire ? parseTimer(expire, this.state.currentTime) : ''}
          </Text>
          {expire > Date.now() ?
            <TouchableOpacity onPress={() => this.props.notifyMechanic()}>
              <View style={{backgroundColor: '#FF8300', borderRadius: 8, padding: 12, marginTop: 10}}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>NOTIFY MECHANIC</Text>
              </View>
            </TouchableOpacity>
            :
            null
          }
        </View>
        <View style={styles.inputView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lockedInputLabel}>Production Day:</Text>
            <Text style={styles.lockedText}>{currDate}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lockedInputLabel}>Line:</Text>
            <Text style={styles.lockedText}>{this.props.lines[this.props.lineIndex].name}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lockedInputLabel}>Line Leader:</Text>
            <Text style={styles.lockedText}>{this.props.names[this.props.nameIndex].name}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 18, color: '#888888'}}>Shift:</Text>
            <Text style={styles.lockedText}>{`${this.state.availableMin / 60} HOURS`}</Text>
          </View>
        </View>
        <View style={styles.inputView}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10}}>
            <Text style={styles.inputLabel}>Downtime:</Text>
            <TextInput
              keyboardType='numeric'
              returnKeyType='done'
              maxLength={3}
              style={[styles.textInput, {borderColor: this.props.downtime ? '#83D3D6' : '#FF8300'}]}
              placeholder={Math.floor((Date.now() - (this.props.expire - 1000*60*20)) / 60000).toString()}
              value={this.props.downtime}
              onChangeText={(text) => this.props.handleDowntimeInput(text)}
            />
            <Text style={{marginLeft: 10, fontSize: 18, color: this.state.downtime ? 'black' : '#888888'}}>Minutes</Text>
          </View>
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputLabel}>Description:</Text>
          <TextInput multiline={true} numberOfLines={10} placeholder='Type the description of the downtime here...' style={[styles.textarea, {borderColor: this.props.description ? '#83D3D6' : '#FF8300'}]} value={this.props.description} onChangeText={(text) => this.props.handleDescriptionInput(text)}/>
        </View>
        <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 30, paddingHorizontal: 20}}>Add photos to your description (Optional. Max 4 photos)</Text>
        <View style={[styles.inputView, {flexDirection: 'row', alignItems: 'center'}]}>
          <TouchableOpacity onPress={this.addImage}>
            <View style={styles.addButton}>
              <Image source={plusIcon} style={{width: 40, height: 40}}/>
            </View>
          </TouchableOpacity>
          <FlatList
            horizontal
            scrollEnabled
            data={this.state.images}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            key={this.state.images.length}
          />
          <ImageModal selectedImage={this.state.selectedImage} showModal={this.state.showModal} toggleModal={this.toggleModal} />
        </View>
        <TouchableOpacity
          onPress={() => this.props.upload(this.props.navigation, this.state.images, this.props.downtime, this.props.description, this.props.names[this.props.nameIndex].name, this.state.availableMin )}
          disabled={!(this.props.downtime && this.props.description) || this.props.submitted}
        >
          <View style={{backgroundColor: (this.props.downtime && this.props.description) ? '#83D3D6' : '#f1f1f1', alignItems: 'center', justifyContent: 'center', height: 80}}>
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
  lockedInputLabel: {
    fontSize: 18,
    marginBottom: 20,
    color: '#888888'
  },
  inputLabel: {
    flex: 1,
    fontSize: 18,
  },
  lockedText: {
    fontSize: 18,
    color: '#888888',
    marginLeft: 'auto'
  },
  input: {
    fontSize: 18
  },
  textInput: {
    fontSize: 18,
    width: 60,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    textAlign: 'center'
  },
  textarea: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    marginVertical: 20,
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
    fontSize: 18
  },
  AnimatedView: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 80,
    backgroundColor: 'green',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

function mapStateToProps(state) {
  return {
    lines: state.splash.lines,
    names: state.splash.names,
    nameIndex: state.name.nameIndex,
    ...state.grid,
    ...state.input
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleDowntimeInput: (text) => dispatch(handleDowntime(text)),
    handleDescriptionInput: (text) => dispatch(handleDescription(text)),
    upload: (navigation, images, downtime, description, name, availableMin) => dispatch(handleUpload(navigation, images, downtime, description, name, availableMin)),
    setActiveLine: (lineId, machineId) => dispatch(insertActiveLine(lineId, machineId)),
    removeActiveLine: (lineId) => dispatch(deleteActiveLine(lineId)),
    changeActiveMachine: (machineId) => dispatch(setActiveMachine(machineId)),
    notifyMechanic: () => dispatch(notifyMechanic())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Input);
