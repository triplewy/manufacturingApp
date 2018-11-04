import React from 'react';
import {ScrollView, Dimensions, View, Image, StyleSheet, FlatList, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal'

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
    return (
      <TouchableOpacity onPress={() => this.selectImage(item.item.url)}>
        <Image
          source={{uri: item.item.url}}
          style={{width: 150, height: 150, margin: 10, borderRadius: 8}}
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
            <Text>Line Leader Name</Text>
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
            {/* <Text style={{marginLeft: 5, fontSize: 18, textAlign: 'right', marginBottom: 20}}>Downtime</Text> */}
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
              scrollEnabled
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
                <Image
                  source={{uri: this.state.selectedImage}}
                  style={{width: win.width - 40, height: (win.width - 40) * this.state.imageHeight / this.state.imageWidth, borderRadius: 8}}
                />
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
