import React from 'react';
import { connect } from 'react-redux'
import { ScrollView, View, Platform, Dimensions, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity } from 'react-native';

class GridItem extends React.PureComponent {
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
          <View style={[styles.icon, { borderColor: this.props.activeMachine === this.props.machineId ? '#FF8300' : 'white' }]}>
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
var imageWidth = 9
var gridWidth = 6
if (!Platform.isPad) {
  imageWidth = 6
  gridWidth = 4
}
const styles = StyleSheet.create({
  gridItem: {
    margin: win.width / 25,
    alignItems: 'center',
    width: win.width / gridWidth,
  },
  icon: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    borderRadius: 8,
    borderWidth: 3
  },
  iconTitle: {
    paddingVertical: 10,
    fontSize: 14,
    alignItems: 'center'
  },
  image: {
    width: win.width / imageWidth,
    height: win.width / imageWidth
  }
})

function mapStateToProps(state) {
  return {
    ...state.grid
  }
}

export default connect(mapStateToProps)(GridItem);
