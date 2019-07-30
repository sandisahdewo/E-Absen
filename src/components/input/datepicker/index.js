import React, { Component } from 'react'
import { View, Text, StyleSheet, DatePickerAndroid, TextInput } from 'react-native'
// import { Item, Label, Input } from 'native-base'
import { format, addDays } from 'date-fns'

class Datepicker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value : '',
    }
  }

  render () {
    const hasError = React.Children.count(this.props.error) > 0 && this.props.error ? true : false;
    
    return(
      <View>
          <Text style={{fontSize:10}}>{this.props.title}</Text>
          <TextInput style={{ height:40, padding:0, margin:0, borderBottomColor:'grey', borderBottomWidth:0.5}} value={this.props.value} onTouchStart={() => this.setDateAndroid()}  />
          {/* <Input value={this.props.value} onTouchStart={() => this.setDateAndroid()} /> */}
        <Text style={{color:'red', fontSize:10, paddingLeft:3}}>{this.props.error}</Text>
      </View>
    )
  }

  setDateAndroid = async () => {
    try {
      const {
        action, year, month, day,
      } = await DatePickerAndroid.open({
        date: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        let value = format(new Date(year, month, day), 'DD-MM-YYYY')
        this.setState({value : value})
        this.props.onSelected(value)
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };
}

Datepicker.defaultProps = {
  maxDate: addDays(new Date(), 360),
  minDate: ''
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12
  },
  labelError: {
    fontSize: 12,
    color: 'red'
  }
});

export default Datepicker;