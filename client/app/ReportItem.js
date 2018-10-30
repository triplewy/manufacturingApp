import React from 'react';
import {ScrollView, View, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity} from 'react-native';

export default class ReportItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    var reportedDate = new Date(this.props.reportedDate)
    var options1 = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

    return (
      <View style={styles.wrapper}>
        <View style={{flexDirection: 'row', padding: 20}}>
          <Text style={{flex: 1}}>{reportedDate.toLocaleDateString('en-US', options1)}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{marginRight: 5, fontSize: 18}}>Line</Text>
            <Text style={{fontSize: 18}}>{this.props.lineId}</Text>
          </View>
          <Text style={{flex: 1, textAlign: 'right'}}>{reportedDate.getTime()}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, padding: 20}}>

            <View>
              <Image
                source={{uri: this.props.icon_url}}
                resizeMode={'contain'}
                style={{width: 90, height: 90, borderRadius: 8}}
              />
              <Text style={{fontSize: 18, marginBottom: 10}}>{this.props.name}</Text>
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
              <Text style={{fontSize: 18}}>{this.props.downtime}</Text>
              <Text style={{marginLeft: 5, fontSize: 18}}>Minutes Downtime</Text>
            </View>
          </View>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{borderBottomWidth: 1, borderColor: '#888888', flex: 1, marginBottom: 8}}/>
            <Text style={{fontSize: 18, paddingHorizontal: 20, color: '#888888'}}>Description</Text>
            <View style={{borderBottomWidth: 1, borderColor: '#888888', flex: 1, marginBottom: 8}}/>
          </View>
          <View style={{paddingVertical: 20}}>
            <Text style={{fontSize: 16}}>{this.props.description}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
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
