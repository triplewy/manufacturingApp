import React from 'react';
import {ScrollView, View, Platform, Dimensions, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import machineIcon from '../icons/machine-icon.png'

export default class GridItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const win = Dimensions.get('window');
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Input', {...this.props})}>
        <View style={styles.gridItem}>
          <View styles={styles.icon}>
            <Image
              source={{uri: this.props.icon_url}}
              resizeMode={'contain'}
              style={styles.image}
            />
          </View>
          <Text style={styles.iconTitle}>{this.props.name}</Text>
        </View>
      </TouchableOpacity>

    )
  }
}

const win = Dimensions.get('window');
var imageWidth = 8
var gridWidth = 6
if (!Platform.isPad) {
  imageWidth = 6
  gridWidth = 4
}
const styles = StyleSheet.create({
  gridItem: {
    margin: win.width / 25,
    alignItems: 'center',
    width: win.width / gridWidth
  },
  icon: {
    backgroundColor: 'white',
    borderRadius: 8
  },
  iconTitle: {
    padding: 10,
    fontSize: 16,
    alignItems: 'center'
  },
  image: {
    width: win.width / imageWidth,
    height: win.width / imageWidth,
    borderRadius: 8
  }
})
