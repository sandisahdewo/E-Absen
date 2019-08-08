import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Toast } from 'native-base'
import { Icon, ListItem, Button } from 'react-native-elements'
import APIStatistik from '../../services/statistik-apel'
import Spinner from 'react-native-loading-spinner-overlay'

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
    this.state = {
      spinner: true,
      statistik: {
        apel: {},
        hadir: 0,
        izin: []
      }
    }
  }

  componentDidMount = () => {
    this.getStatistik()
    this.setState({
      spinner: true
    })
  }

  getStatistik = () => {
    APIStatistik.GetStatistik()
      .then(res => {
        if(res.success) {
          this.setState({
            statistik: res.data,
            spinner: false
          })
        } else {
          Toast.show({
            text: res.message,
            buttonText: 'Okay',
            type:'danger'
          })
          this.setState({
            spinner: false
          })
        }
      })
      .catch(err => {
        console.log('err', err)
        this.setState({
          spinner: false
        })
      })
  }

  mapIzin = () => {
    return this.state.statistik.izin.map((value, key) => {
      return (
        <ListItem
          key={key}
          leftIcon={
            <Icon name="car" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='green' />
          }
          title={value.title}
          rightTitle={`${value.total} Orang`}
          rightTitleStyle={{color:'white', backgroundColor:'green', borderRadius:13, paddingHorizontal:10}}
          bottomDivider={true}
        />
      )
    })
  }

  render() {
    return (
      <ScrollView>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color:'#FFF'}}
        />
        <View style={{flex:1, marginHorizontal:10}}>
          <View style={{marginBottom:10, flexDirection:'row'}}>
            <Text>Laporan E-Apel, Tanggal </Text>
            <Text style={{fontWeight:'bold'}}>{this.state.statistik.apel.tanggal_view}</Text>
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
                <Icon name="users" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='green' />
              }
              title='Hadir Apel'
              rightTitle={`${this.state.statistik.hadir} Orang`}
              rightTitleStyle={{color:'white', backgroundColor:'green', borderRadius:13, paddingHorizontal:10}}
              bottomDivider={true}
            />

            {this.state.statistik.izin.map((value, key) => 
              (
                <ListItem
                  key={key}
                  leftIcon={
                    <Icon name="info" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='red' />
                  }
                  title={value.title}
                  rightTitle={`${value.total} Orang`}
                  rightTitleStyle={{color:'white', backgroundColor:'red', borderRadius:13, paddingHorizontal:10}}
                  bottomDivider={true}
                />
              )
            )}
            {/* <ListItem
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
            /> */}
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
                buttonStyle={{borderColor:'#696969', marginTop:15, marginBottom:5}}
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
      </ScrollView>
    )
  }

}