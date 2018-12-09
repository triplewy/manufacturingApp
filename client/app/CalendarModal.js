import React from 'react';
import {ScrollView, View, RefreshControl, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity, Image} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import Modal from 'react-native-modal'
import calendarIcon from './icons/calendar-icon.png'

export default class CalendarModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };

    this.selectItem = this.selectItem.bind(this)
  }

  selectItem(day) {
    this.setState({showModal: false})
    this.props.selectDate(day.dateString)
  }

  render() {
    const win = Dimensions.get('window');
    return (
      <View style={{marginVertical: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        {this.props.date ?
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={{fontSize: 18}}>{this.props.date}</Text>
            <TouchableOpacity style={{marginLeft: 20}} onPress={() => this.selectItem({dateString: ''})}>
              <Text style={{fontSize: 18, color: '#FF8300', fontWeight: 'bold'}}>ALL DATES</Text>
            </TouchableOpacity>
          </View>
        :
          <Text style={styles.timePeriodTitle}>ALL DATES</Text>
        }
        <TouchableOpacity onPress={() => this.setState({ showModal: true })}>
          <Image source={calendarIcon} style={{width: 50, height: 50}} />
          {/* <View style={{backgroundColor: '#FF8300', borderRadius: 8}}>
            <Text style={{fontSize: 18, paddingVertical: 10, paddingHorizontal: 15, color: 'white'}}>Choose</Text>
          </View> */}
        </TouchableOpacity>
        <Modal
          isVisible={this.state.showModal}
          onBackdropPress={() => this.setState({ showModal: false })}
          style={{justifyContent: 'center', alignItems: 'center'}}
        >
          <Calendar
            onDayPress={(day) => this.selectItem(day)}
            markedDates={{[this.props.date]: {selected: true, disableTouchEvent: true, selectedDotColor: 'blue'}}}
            style={{width: win.width - 80, borderRadius: 8, padding: 20}}
            theme={{textDayFontSize: 21, textMonthFontSize: 24, textDayHeaderFontSize: 16}}
          />
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  timePeriodTitle: {
    flex: 1,
    fontSize: 18
  },
  timePeriodToggle: {
    fontSize: 21,
    padding: 20
  },
  statsView: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 40
  }
})
