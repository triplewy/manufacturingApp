import React from 'react';
import {ScrollView, Dimensions, View, Image, ImageBackground, StyleSheet, FlatList, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal'
import closeIcon from './icons/close-icon.png'

export default class ImageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const win = Dimensions.get('window');

    return (
      <Modal
        isVisible={this.props.showModal}
        onBackdropPress={this.props.toggleModal}
        onSwipe={this.props.toggleModal}
        swipeDirection='up'
      >
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <ImageBackground
            resizeMode={'contain'}
            source={{uri: this.props.selectedImage}}
            imageStyle={{borderRadius: 8}}
            style={{width: win.width - 40, height: (win.width - 40) * 4 / 3}}
          >
          </ImageBackground>
          <TouchableOpacity onPress={this.props.toggleModal} style={{position: 'absolute', top: 10, left: 10}}>
            <Image
              source={closeIcon}
              style={{width: 60, height: 60}}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 80,
    backgroundColor: 'white',
  },
  icon: {
    backgroundColor: 'white',
    borderRadius: 8
  },
  iconTitle: {
    padding: 10,
    alignItems: 'center'
  }
})
