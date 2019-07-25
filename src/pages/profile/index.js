import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Thumbnail, Card, Toast } from 'native-base'
import { ListItem, Button, Icon } from 'react-native-elements'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import { ScrollView } from 'react-native-gesture-handler'
import { User } from '../../storage/async-storage'
import APIApel from '../../services/apel'

export default class Index extends Component {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#fff',
    headerLeft: (
      <View>
        <TouchableHighlight>
          <View style={{marginLeft: 15}}>
            <IconFA5 name="sign-out-alt" size={22} color="#808080"/>
          </View>
        </TouchableHighlight>
      </View>
    ),
  }

  constructor(props) {
    super(props)

    this.state = {
      user: {
        pegawai: {}
      },
      lastCheckIn: {
        date:'',
        time:''
      },
      apelToday: false
    }

    this.getUserLogin()
  }

  getUserLogin = async () => {
     const user = await User.getUserLogin()
     this.setState({
       user: user
     }, () => {
       this.getLastCheckInToday(this.state.user.id)
     })
  }

  getLastCheckInToday = async (userId) => {
    await APIApel.FindLastCheckinToday(userId)
            .then(res => {
              this.setState({
                lastCheckIn:{
                  date:res.data.tanggal_checkin,
                  time:res.data.waktu_checkin
                },
                apelToday: true
              })
            })
            .catch(err => {
              if(err.response.status == '404') {
                this.setState({
                  apelToday: false
                })
              } else {
                Toast.show({
                  text:err.message,
                  position:'bottom',
                  type:'danger'
                })
              }
            })
  }

  render() {
    const apelToday = this.state.apelToday;
    return ( 
      <ScrollView style={{flex:1}}>
        <View style={{alignItems: 'center', backgroundColor:'#eeeeee', paddingBottom:20}}>
          <Thumbnail large source={require('../../assets/avatars/sari.jpg')}/> 
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.state.user.name}</Text>
        </View>
        <View style={{marginTop:10, borderBottomColor:'#dcdcdc', borderBottomWidth:1}}>
          <ListItem
            containerStyle={{padding:10}}
            title={this.state.user.username}
            titleStyle={{color:'black'}}
            subtitle='Nomor Induk Pegawai'
            leftIcon={{name:'key', type:'font-awesome'}}
            topDivider={true}
          />

          <ListItem
            containerStyle={{padding:10}}
            title={this.state.user.pegawai.satker}
            titleStyle={{color:'black'}}
            subtitle='Satuan Kerja'
            leftIcon={{name:'university', type:'font-awesome'}}
            topDivider={true}
          />

          <ListItem
            containerStyle={{padding:10}}
            title='Kepala Sub Bidang'
            titleStyle={{color:'black'}}
            subtitle='Jabatan'
            leftIcon={{name:'heart', type:'font-awesome'}}
            topDivider={true}
          />

        </View>
        <View style={{margin:8}}>
          {apelToday &&
            <Card style={{padding:15}}>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                  <Text style={{fontSize:14}}>Mengikuti Apel Pada: {this.state.lastCheckIn.time}</Text>
                  <Text style={{fontWeight:'bold', fontSize:17}}>Terimakasih telah hadir</Text>
                </View>
                <View style={{justifyContent:'center', flex:0.4}}>
                  <Icon
                    name="street-view"
                    size={35}
                    type='font-awesome'
                    iconStyle={{marginRight:5}}
                    color='#696969'
                    />
                </View>
              </View>
            </Card>
          }
          {!apelToday && 
            <Card style={{padding:15}}>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                  <Text style={{fontSize:14}}>Apel dilaksanakan pada: 15:02</Text>
                  <Text style={{fontWeight:'bold', fontSize:17}}>Tidak berada dilokasi Apel</Text>
                </View>
                <View style={{justifyContent:'center', flex:0.4}}>
                  <Icon
                    name="user-times"
                    size={29}
                    type='font-awesome'
                    iconStyle={{marginRight:5}}
                    color='#696969'
                  />
                </View>
              </View>
            </Card>
          }
        </View>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:1, margin:5}}>
            <Button
              onPress={() => this.props.navigation.navigate('ApelIndex')}
              title="Hadir Apel"
              type="outline"
              buttonStyle={{borderColor:'#696969'}}
              titleStyle={{color:'#696969'}}
            />
          </View>
          <View style={{flex:1, margin:5}}>
            <Button
              onPress={() => this.props.navigation.navigate('IzinIndex')}
              title="Izin Apel"
              type="outline"
              buttonStyle={{borderColor:'#696969'}}
              titleStyle={{color:'#696969'}}
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

