import React from 'react';
import { View, Image, ImageBackground, FlatList, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import { insertImage, removeImage } from './addImages.operations'
import { connect } from 'react-redux'
import plusIcon from '../icons/plus-icon.png'
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import deleteIcon from '../icons/delete-icon.png'
import ImageModal from '../ImageModal'

class AddImages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      selectedImage: null,
    }

    this.addImage = this.addImage.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  addImage() {
     if (this.props.images.length > 3) {
       Alert.alert(
         'Exceeded photos limit',
         'Max 4 photos',
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
           ImageResizer.createResizedImage(response.uri, 1080, 1080 * 4 / 3, 'JPEG', 75).then((res) => {
             // response.uri is the URI of the new image that can now be displayed, uploaded...
             // response.path is the path of the new image
             // response.name is the name of the new image with the extension
             // response.size is the size of the new image
             this.props.addImage({ uri: res.uri })
           }).catch((err) => {
             console.log(err)
           })
         }
       })
     }
   }

  renderItem(item) {
    return (
      <View style={{margin: 20}}>
        <TouchableOpacity onPress={() => this.setState({selectedImage: item.item.uri, showModal: true})}>
          <Image
            source={{uri: item.item.uri}}
            style={{width: 100, height: 100, borderRadius: 8}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.deleteImage(item.index)} style={{position: 'absolute', right: -25, top: -25}}>
          <Image
            source={deleteIcon}
            style={{width: 50, height: 50}}
          />
        </TouchableOpacity>
      </View>
    )
  }

  toggleModal() {
    this.setState({showModal: !this.state.showModal})
  }

  render() {
    return (
      <View style={styles.inputView}>
        <TouchableOpacity onPress={this.addImage}>
          <View style={styles.addButton}>
            <Image source={plusIcon} style={{width: 40, height: 40}}/>
          </View>
        </TouchableOpacity>
        <FlatList
          horizontal
          scrollEnabled
          data={this.props.images}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.props.images}
        />
        <ImageModal selectedImage={this.state.selectedImage} showModal={this.state.showModal} toggleModal={this.toggleModal} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 50
  },
  addButton: {
    height: 100,
    width: 100,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

function mapStateToProps(state) {
  return {
    ...state.addImages
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addImage: (img) => dispatch(insertImage(img)),
    deleteImage: (index) => dispatch(removeImage(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddImages);
