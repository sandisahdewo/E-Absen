import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Toast } from 'native-base'
import { Icon, ListItem, Button } from 'react-native-elements'
import APIStatistik from '../../services/statistik-apel'
import Spinner from 'react-native-loading-spinner-overlay'
import { User } from '../../storage/async-storage'

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
      responseStatus: {
        success: true,
        type:'apel_not_exist'
      },
      statistik: {
        apel: {},
        hadir: 0,
        izin: []
      },
      user: {
        pegawai: {}
      }
    }
  }

  componentDidMount = () => {
    this.getUserLogin()
    this.setState({
      spinner: true
    })
  }

  getUserLogin = async () => {
    const user = await User.getUserLogin()
    this.setState({
      user: user
    }, () => {
      this.getStatistik(this.state.user.admin_satker)
    })

  }

  getStatistik = (satkerId) => {
    APIStatistik.GetStatistik(satkerId)
      .then(res => {
        if(res.success) {
          this.setState({
            responseStatus: {
              success: res.success,
              type: res.type
            },
            statistik: res.data,
            spinner: false
          })
        } else {
          this.setState({
            spinner: false
          })
        }
      })
      .catch(err => {
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
    const responseSuccess = this.state.responseStatus.success == true
    const apelNotExist = responseSuccess && this.state.responseStatus.type == 'apel_not_exist'
    const apelCloseExist = responseSuccess && this.state.responseStatus.type == 'apel_close_exist'
    const apelCloseNotExist = responseSuccess && this.state.responseStatus.type == 'apel_close_not_exist'
    
    return (
      <View style={{flex:1}}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color:'#FFF'}}
        />
        {apelCloseExist && 
        <View style={{flex:1, marginHorizontal:10}}>
          <View style={{marginBottom:10, flexDirection:'row'}}>
            <Text>Laporan E-Apel, Tanggal </Text>
            <Text style={{fontWeight:'bold'}}>{this.state.statistik.apel.tanggal_view}</Text>
            <Text> sebagai berikut:</Text>
          </View>

          <View style={{backgroundColor: 'red', padding:15}}>
            <View style={{flexDirection:'row'}}>
              <Icon name="bar-chart" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='white' />
              <Text style={{color:'white', fontSize:18}}>Statistik Apel Satuan Kerja {this.state.statistik.satker.satuan_kerja}</Text>
            </View>
          </View>

          <View style={{marginTop:10}}>
            <ListItem
              leftIcon={
                <Icon name="users" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='grey' />
              }
              title='Total Pegawai'
              rightTitle={`${this.state.statistik.total} Orang`}
              rightTitleStyle={{color:'white', backgroundColor:'grey', borderRadius:13, paddingHorizontal:10}}
              bottomDivider={true}
            />
            <ListItem
              leftIcon={
                <Icon name="check" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='green' />
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
                    <Icon name="info" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='orange' />
                  }
                  title={value.title}
                  rightTitle={`${value.total} Orang`}
                  rightTitleStyle={{color:'white', backgroundColor:'orange', borderRadius:13, paddingHorizontal:10}}
                  bottomDivider={true}
                />
              )
            )}
            <ListItem
              leftIcon={
                <Icon name="close" size={24} type='font-awesome' iconStyle={{marginRight:5}} color='red' />
              }
              title='Tanpa Keterangan'
              rightTitle={`${this.state.statistik.tanpa_keterangan} Orang`}
              rightTitleStyle={{color:'white', backgroundColor:'red', borderRadius:13, paddingHorizontal:10}}
              bottomDivider={true}
            />
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
                onPress={() => this.props.navigation.navigate('ProfileIndex')}
              />
            </View>
          </View>
        </View>
        }
        {apelNotExist && 
          <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
            <Text style={{fontSize:18}}>Tidak ada apel hari ini</Text>
          </View>
        }
        {apelCloseNotExist && 
          <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
            <Text style={{fontSize:18}}>Apel periode sekarang belum tutup</Text>
          </View>
        }
      </View>
    )
  }

}