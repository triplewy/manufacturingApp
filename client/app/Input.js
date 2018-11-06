import React from 'react';
import {Animated, Easing, Dimensions, ScrollView, View, Image, ImageBackground, RefreshControl, FlatList, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity} from 'react-native';
import plusIcon from './icons/plus-icon.png'
import ImagePicker from 'react-native-image-picker';
import deleteIcon from './icons/delete-icon.png'
import { getName } from './Storage'

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.widthValue = new Animated.Value(0)
    this.state = {
      name: '',
      downtime: null,
      description: '',
      submitted: false,
      progress: 0,
      images: []
    };

    this.handleDowntimeChange = this.handleDowntimeChange.bind(this)
    this.addImage = this.addImage.bind(this)
    this.deleteImage = this.deleteImage.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.submut = this.submit.bind(this)
    this.upload = this.upload.bind(this)
  }

  componentDidMount() {
    getName().then(name => {
      this.setState({name: name})
    })
  }

  handleDowntimeChange(text) {
    this.setState({downtime: text.replace(/[^0-9]/g, '')});
  }

  addImage() {
    ImagePicker.showImagePicker(null, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({images: this.state.images.concat(source)})
      }
    })
  }

  deleteImage(index) {
    console.log("helllllooooo");
    var temp = this.state.images
    temp.splice(index, 1)
    this.setState({images: temp})
  }

  renderItem(item) {
    return (
      <ImageBackground
        source={{uri: item.item.uri}}
        resizeMode={'contain'}
        style={{width: 150, height: 150, margin: 20}}
        imageStyle={{borderRadius: 8}}
      >
        <TouchableOpacity onPress={this.deleteImage.bind(this,item.index)}>
          <Image
            source={deleteIcon}
            style={{position: 'absolute', width: 40, height: 40, right: -20, top: 0}}
          />
        </TouchableOpacity>
      </ImageBackground>
    )
  }

  submit() {
    var navigationProps = this.props.navigation.state.params
    var formData = new FormData();
    for (var i = 0; i < this.state.images.length; i++) {
      formData.append('image', {uri: this.state.images[i].uri, name: "file"})
    }
    formData.append('machineId', navigationProps.machineId);
    formData.append('downtime', this.state.downtime);
    formData.append('description', this.state.description);

    this.setState({submitted: true})
    this.upload(formData)
  }

  upload(formData) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onreadystatechange = () => {
     if(xhr.readyState === 4 && xhr.status === 200){
         console.log(xhr.responseText);
         this.setState({uploaded: true})
         this.props.navigation.navigate('Grid')
      } else {
        console.log(xhr.responseText);
      }
    }

    xhr.upload.onprogress = (e) => {
      const win = Dimensions.get('window');
      this.widthValue.setValue(win.width * e.loaded/e.total)
      this.setState({progress: e.loaded/e.total})
    }

    xhr.open('POST', global.API_URL + '/api/input/submit');
    xhr.send(formData)
  }

  render() {
    var options = { weekday: 'long', month: 'short', day: 'numeric' };
    var currDate = new Date().toLocaleDateString('en-US', options)
    console.log(this.state.images.length);
    return (
      <ScrollView>
        <View style={styles.inputView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lockedInputLabel}>Production Day:</Text>
            <Text style={styles.lockedText}>{currDate}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lockedInputLabel}>Line:</Text>
            <Text style={styles.lockedText}>{this.props.navigation.state.params.lineId}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 18, color: '#888888'}}>Line Leader:</Text>
            <Text style={styles.lockedText}>{this.state.name}</Text>
          </View>
        </View>
        <View style={styles.inputView}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.inputLabel}>Downtime:</Text>
            <TextInput keyboardType='numeric' returnKeyType='done' maxLength={3} style={[styles.textInput, {color: this.state.downtime ? 'black' : '#888888'}]} placeholder='0' value={this.state.downtime} onChangeText={(text) => this.handleDowntimeChange(text)}/>
            <Text style={{marginLeft: 10, fontSize: 18, color: this.state.downtime ? 'black' : '#888888'}}>Minutes</Text>
          </View>
        </View>
        <View style={styles.inputView}>
          <Text style={styles.inputLabel}>Description:</Text>
          <TextInput multiline={true} numberOfLines={10} style={styles.textarea} value={this.state.description} onChangeText={(text) => this.setState({description: text})}/>
        </View>
        <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 30, paddingHorizontal: 20}}>Add photos to your description (Optional. Max 4 photos)</Text>
        <View style={[styles.inputView, {flexDirection: 'row', alignItems: 'center'}]}>
          <TouchableOpacity onPress={this.addImage.bind(this)}>
            <View style={styles.addButton}>
              <Image source={plusIcon} style={{width: 50, height: 50}}/>
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
        </View>
        <TouchableOpacity onPress={this.submit.bind(this)} disabled={!(this.state.downtime && this.state.description) || this.state.submitted}>
          <View style={{backgroundColor: (this.state.downtime && this.state.description) ? '#83D3D6' : '#f1f1f1', alignItems: 'center', justifyContent: 'center', height: 80}}>
            <Text style={styles.submitButton}>Submit</Text>
            <Animated.View style={[styles.AnimatedView,{width: this.widthValue}]}>
              <Text style={{color: 'white'}}>{Math.round(this.state.progress * 100)}</Text>
            </Animated.View>
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
  textInput: {
    fontSize: 18,
    width: 50,
    textAlign: 'right',
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
