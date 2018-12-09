import React from 'react';
import {ScrollView, Dimensions, View, Image, ImageBackground, StyleSheet, FlatList, Text, TouchableHighlight, TouchableOpacity} from 'react-native';
import ImageModal from './ImageModal'
import { downtimeString } from './DowntimeString.js'

export default class ReportItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      selectedImage: null,
    };

    this.renderItem = this.renderItem.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  renderItem(item) {
    const win = Dimensions.get('window');
    return (
      <TouchableOpacity onPress={() => this.setState({selectedImage: item.item.url, showModal: true})}>
        <Image
          source={{uri: item.item.url}}
          style={{width: (win.width - 100) / 4, height: (win.width - 100) / 4, margin: 10, borderRadius: 8}}
        />
      </TouchableOpacity>
    )
  }

  toggleModal() {
    this.setState({showModal: !this.state.showModal})
  }

  render() {
    const options = {timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'}
    const date = new Date(this.props.reportedDate).toLocaleDateString('en-US', options)
    const win = Dimensions.get('window');
    const downtime = downtimeString(this.props.downtime)

    return (
      <View style={styles.wrapper}>
        <View style={{flexDirection: 'row', padding: 20}}>
          <View style={{flex: 1}}>
            <Text style={{color: 'gray', fontSize: 18, marginBottom: 20}}>{this.props.lineLeaderName}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginRight: 5, fontSize: 24}}>Line</Text>
              <Text style={{fontSize: 24}}>{this.props.name}</Text>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{uri: this.props.icon_url}}
              style={{width: 80, height: 80, borderRadius: 8}}
            />
            <Text style={{fontSize: 18, marginTop: 5}}>{this.props.machineName}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{marginBottom: 20, fontSize: 18, textAlign: 'right', color: 'gray'}}>{date}</Text>
            <Text style={{fontSize: 24, fontWeight: '600', color: '#FF8300', textAlign: 'right'}}>{downtime}</Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <View style={{flex: 1, height: 1, backgroundColor: '#888888', marginTop: 10}} />
          <View style={{paddingVertical: 30, alignItems: 'center'}}>
            <Text style={{fontSize: 18}}>{this.props.description}</Text>
            <FlatList
              horizontal
              scrollEnabled={false}
              data={this.props.images}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            />
            <ImageModal selectedImage={this.state.selectedImage} showModal={this.state.showModal} toggleModal={this.toggleModal} />
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
