import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { Thumbnail, Card, Toast } from 'native-base'
import { ListItem, Button, Icon } from 'react-native-elements'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import { ScrollView } from 'react-native-gesture-handler'
import { User } from '../../storage/async-storage'
import Spinner from 'react-native-loading-spinner-overlay'
import APIApel from '../../services/apel'
import NetInfo from '../../components/netinfo'

let _this;

export default class Index extends Component {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#fff',
    headerLeft: (
      <View>
        <TouchableHighlight onPress={() => _this.logout()}>
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
      apelTodayExists: false,
      apelTodayData: {},
      spinner: true,
      user: {
        pegawai: {}
      },
      checkinTodayExists: false,
      checkinTodayData: {
        date:'',
        time:''
      },
    }

  }

  componentDidMount = () => {
    this.props.navigation.addListener('willFocus', 
      () => {
        _this = this;
        this.getUserLogin()
        this.findApelToday()
      }
    )
  }

  getUserLogin = async () => {
      const user = await User.getUserLogin()
      this.setState({
        user: user,
      })

      await this.getLastCheckInToday(user.id)
  }

  findApelToday = async () => {
    await APIApel.FindApelToday()
      .then(res => {
        if(res.success) {
          this.setState({
            apelTodayExists: true,
            apelTodayData: res.data
          })
        } else {
          this.setState({
            apelTodayExists: false,
          })
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  getLastCheckInToday = async (userId) => {
    await APIApel.FindLastCheckinToday(userId)
            .then(res => {
              if(res.success) {
                this.setState({
                  checkinTodayData:{
                    date:res.data.tanggal_checkin,
                    time:res.data.waktu_checkin
                  },
                  checkinTodayExists: true,
                  spinner: false
                })
              } else {
                this.setState({
                  checkinTodayExists: false,
                  spinner: false
                })
              }
            })
            .catch(err => {
              Toast.show({
                text:err.message,
                position:'bottom',
                type:'danger'
              })
              this.setState({
                checkinTodayExists: false,
                spinner: false
              })
              console.log('err', err)
            })
  }

  logout = async () => {
    await User.removeUserLogin()
    this.props.navigation.navigate('Auth')
  }

  render() {
    const showLastCheckin = this.state.checkinTodayExists
    const showApelTodayExists = (this.state.apelTodayExists && !this.state.checkinTodayExists)
    const showApelTodayNotExists = !this.state.apelTodayExists
    const showButtonApel = showApelTodayExists && this.state.apelTodayData.status == 'buka'
    const showButtonApelAndIzin = showApelTodayExists

    return ( 
      <NetInfo>
      <ScrollView style={{flex:1}}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color:'#FFF'}}
        />
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
          {showLastCheckin &&
            <Card style={{padding:15}}>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                  <Text style={{fontSize:14}}>Mengikuti Apel Pada: {this.state.checkinTodayData.time}</Text>
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
          { showApelTodayExists && 
            <Card style={{padding:15}}>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                  <Text style={{fontSize:14}}>Apel dilaksanakan pada: {this.state.apelTodayData.jam_apel}</Text>
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
          { showApelTodayNotExists &&
            <Card style={{padding:15}}>
              <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                  <Text style={{fontWeight:'bold', fontSize:17}}>Tidak ada Apel</Text>
                </View>
              </View>
            </Card>
          }
        </View>
        { showButtonApelAndIzin &&
          <View style={{flex:1, flexDirection:'row'}}>
            {showButtonApel &&
              <View style={{flex:1, margin:5}}>
                <Button
                  onPress={() => this.props.navigation.navigate('ApelIndex', {apelId: this.state.apelTodayData.id})}
                  title="Hadir Apel"
                  type="outline"
                  buttonStyle={{borderColor:'#696969'}}
                  titleStyle={{color:'#696969'}}
                />
              </View>
            }
            <View style={{flex:1, margin:5}}>
              <Button
                onPress={() => this.props.navigation.navigate('IzinIndex', {apelId: this.state.apelTodayData.id})}
                title="Izin Apel"
                type="outline"
                buttonStyle={{borderColor:'#696969'}}
                titleStyle={{color:'#696969'}}
              />
            </View>
          </View>
        }
        <View style={{flex:1, marginTop:10, alignItems:'center'}}>
          <View>
            <Button
              onPress={() => this.props.navigation.navigate('EselonIndex')}
              title="Statistik Peserta Apel"
              type="outline"
              buttonStyle={{borderColor:'#696969'}}
              titleStyle={{color:'red'}}
              icon={
                <Icon
                  name="bar-chart"
                  size={19}
                  type='font-awesome'
                  iconStyle={{marginRight:5}}
                  color='red'
                />
              }
            />
          </View>
        </View>
      </ScrollView>
      </NetInfo>
    )
  }
}

