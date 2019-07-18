import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card, Thumbnail } from 'native-base';
import { Icon } from 'react-native-elements';

export default class ListCekIn extends Component {
  render() {
    return ( 
      <Card style={{padding:8}}>
        <View style={{flexDirection:'row', marginBottom:5}}>
          <Icon
              name="flag"
              size={19}
              type='font-awesome'
              iconStyle={{marginRight:5}}
              color='#696969'
            />
          <Text style={{fontSize:16}}>Status: {this.props.status}</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1}}>
            <Text style={{fontWeight:'bold', fontSize:23}}>{this.props.nama}</Text>
            <Text>{this.props.waktu}</Text>
          </View>
          <View style={{flex:1, alignItems:'flex-end'}}>
            <Thumbnail source={require('../../../assets/avatars/sari.jpg')}/> 
          </View>
        </View>
      </Card>
    )
  }
}