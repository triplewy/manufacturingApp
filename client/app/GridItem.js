import React from 'react';
import {ScrollView, View, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import machineIcon from './icons/machine-icon.png'

export default class GridItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    console.log(this.props.name);
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('Input', {machineId: this.props.machineId, title: this.props.name})}>
        <View style={styles.gridItem}>
          <View styles={styles.icon}>
            <Image
              source={{uri: this.props.icon_url}}
              resizeMode={'contain'}
              style={{width: 90, height: 90, borderRadius: 8}}
            />
          </View>
          <Text style={styles.iconTitle}>{this.props.name}</Text>
        </View>
      </TouchableOpacity>

    )
  }
}

const styles = StyleSheet.create({
  gridItem: {
    margin: 50,
    alignItems: 'center'
  },
  icon: {
    backgroundColor: 'white',
    borderRadius: 8
  },
  iconTitle: {
    padding: 10,
    fontSize: 16,
    alignItems: 'center'
  }
})
