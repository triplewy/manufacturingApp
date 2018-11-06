import React from 'react';
import {ScrollView, Dimensions, View, Image, ImageBackground, StyleSheet, FlatList, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal'
import closeIcon from './icons/close-icon.png'

export default class ReportItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      selectedImage: null,
      imageWidth: 0,
      imageHeight: 0
    };

    this.renderItem = this.renderItem.bind(this)
    this.selectImage = this.selectImage.bind(this)
  }

  renderItem(item) {
    const win = Dimensions.get('window');
    return (
      <TouchableOpacity onPress={() => this.selectImage(item.item.url)}>
        <Image
          source={{uri: item.item.url}}
          style={{width: (win.width - 100) / 4, height: (win.width - 100) / 4, margin: 10, borderRadius: 8}}
        />
      </TouchableOpacity>
    )
  }

  selectImage(uri) {
    Image.getSize(uri, (width, height) => {this.setState({showModal: true, selectedImage: uri, imageWidth: width, imageHeight: height})})
  }

  render() {
    var reportedDate = new Date(this.props.reportedDate)
    var options1 = {weekday: 'short', month: 'short', day: 'numeric'}
    const win = Dimensions.get('window');
    return (
      <View style={styles.wrapper}>
        <View style={{flexDirection: 'row', padding: 20}}>
          <View style={{flex: 1}}>
            <Text style={{marginBottom: 20, fontSize: 18}}>{reportedDate.toLocaleDateString('en-US', options1)}</Text>
            <Text style={{marginBottom: 20, fontSize: 18}}>{reportedDate.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})}</Text>
            <View style={{flexDirection: 'row', marginBottom: 20}}>
              <Text style={{marginRight: 5, fontSize: 18}}>Line</Text>
              <Text style={{fontSize: 18}}>{this.props.lineId}</Text>
            </View>
            <Text>{this.props.leaderName}</Text>
          </View>
          <View>
            <View>
              <Image
                source={{uri: this.props.icon_url}}
                resizeMode={'contain'}
                style={{width: 80, height: 80, borderRadius: 8}}
              />
              <Text style={{fontSize: 18, marginBottom: 10}}>{this.props.name}</Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text style={{fontSize: 32, fontWeight: '600', color: '#FF8300'}}>{this.props.downtime}</Text>
              <View style={{justifyContent: 'flex-end'}}>
                <Text style={{marginLeft: 8, fontSize: 32, color: '#FF8300'}}>Min</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{borderBottomWidth: 1, borderColor: '#888888', flex: 1, marginBottom: 8}}/>
            <Text style={{fontSize: 18, paddingHorizontal: 20, color: '#888888'}}>Description</Text>
            <View style={{borderBottomWidth: 1, borderColor: '#888888', flex: 1, marginBottom: 8}}/>
          </View>
          <View style={{paddingVertical: 20, alignItems: 'center'}}>
            <Text style={{fontSize: 18}}>{this.props.description}</Text>
            <FlatList
              horizontal
              scrollEnabled={false}
              data={this.props.images}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            />
            <Modal
              isVisible={this.state.showModal}
              onBackdropPress={() => this.setState({ showModal: false })}
              onSwipe={() => this.setState({ showModal: false })}
              swipeDirection='up'
            >

              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <ImageBackground
                  resizeMode={'contain'}
                  source={{uri: this.state.selectedImage}}
                  imageStyle={{borderRadius: 8}}
                  style={{width: win.width - 40, height: (win.width - 40) * this.state.imageHeight / this.state.imageWidth}}
                >
                  <TouchableOpacity onPress={() => this.setState({showModal: false})}>
                    <View style={{position: 'absolute', top: 10, left: 10}}>
                      <Image
                        source={closeIcon}
                        style={{width: 50, height: 50}}
                      />
                    </View>
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </Modal>
          </View>
        </View>
      </View>
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
