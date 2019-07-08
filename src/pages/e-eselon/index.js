import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Icon, ListItem, Button } from 'react-native-elements'

export default class Index extends Component {

  static navigationOptions = {
    title: 'Statistik E-Apel',
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#808080',
  };

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <View style={{flex:1, marginHorizontal:10}}>
        <View style={{marginBottom:10, flexDirection:'row'}}>
          <Text>Laporan E-Apel, Tanggal </Text>
          <Text style={{fontWeight:'bold'}}>19 Juni 2019</Text>
          <Text> sebagai berikut:</Text>
        </View>

        <View style={{backgroundColor: 'red', padding:15}}>
          <View style={{flexDirection:'row'}}>
            <Icon name="bar-chart" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='white' />
            <Text style={{color:'white', fontSize:18}}>Statistik Apel Dinas Penanaman Modal</Text>
          </View>
        </View>

        <View style={{marginTop:10}}>
          <ListItem
            leftIcon={
              <Icon name="users" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='blue' />
            }
            title='Hadir Apel'
            rightTitle='500 Orang'
            rightTitleStyle={{color:'white', backgroundColor:'blue', borderRadius:13, paddingHorizontal:10}}
            bottomDivider={true}
          />
          <ListItem
            leftIcon={
              <Icon name="car" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='green' />
            }
            title='Dinas Luar'
            rightTitle='30 Orang'
            rightTitleStyle={{color:'white', backgroundColor:'green', borderRadius:13, paddingHorizontal:10}}
            bottomDivider={true}
          />
          <ListItem
            leftIcon={
              <Icon name="bed" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='orange' />
            }
            title='Cuti'
            rightTitle='30 Orang'
            rightTitleStyle={{color:'white', backgroundColor:'orange', borderRadius:13, paddingHorizontal:10}}
            bottomDivider={true}
          />
          <ListItem
            leftIcon={
              <Icon name="user-times" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='red' />
            }
            title='Cuti'
            rightTitle='30 Orang'
            rightTitleStyle={{color:'white', backgroundColor:'red', borderRadius:13, paddingHorizontal:10}}
            bottomDivider={true}
          />
        </View>

        <View style={{flex:1, marginTop:20}}>
          <View style={{alignSelf:'stretch'}}>
            <Button
              title="SPEECH"
              type="outline"
              buttonStyle={{borderColor:'#696969'}}
              titleStyle={{color:'#696969'}}
              icon={
                <Icon
                  name="bullhorn"
                  size={19}
                  type='font-awesome'
                  iconStyle={{marginRight:5}}
                  color='#696969'
                />
              }
            />
         
            <Button
              title="OK"
              type="outline"
              buttonStyle={{borderColor:'#696969', marginTop:15}}
              titleStyle={{color:'#696969'}}
              icon={
                <Icon
                  name="check"
                  size={19}
                  type='font-awesome'
                  iconStyle={{marginRight:5}}
                  color='#696969'
                />
              }
            />
          </View>
        </View>
      </View>
    )
  }

}