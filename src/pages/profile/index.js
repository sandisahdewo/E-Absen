import React, { Component } from 'react'
import { Text, View, TouchableHighlight, Alert, ImageBackground, PermissionsAndroid } from 'react-native'
import { Thumbnail, Card, Toast, Container, Content } from 'native-base'
import { ListItem, Button, Icon } from 'react-native-elements'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import { User } from '../../storage/async-storage'
import Spinner from 'react-native-loading-spinner-overlay'
import APIApel from '../../services/apel'
import NetInfo from '../../components/netinfo'
import Geolocation from '@react-native-community/geolocation';
import {WebPath} from '../../services/config/path'
import {LATITUDE, LONGITUDE} from '../../services/config/location'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import RNExitApp from 'react-native-exit-app';
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
    headerRight: (
      <View>
        <TouchableHighlight onPress={() => _this.changePassword()}>
          <View style={{marginRight: 15}}>
            <Icon name="lock" size={22} color="#808080"/>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  constructor(props) {
    super(props)

    this.state = {
      apelTodayExists: false,
      spinner: true,
      user: {
        pegawai: {}
      },
      apelData: [],
      lastApelData: {
        id: '',
        action_status: '',
        apel_status: ''
      },
      location:{
        latitude: 0,
        longitude: 0,
      },

      // lat: -8.033809,
      // long: 112.649397,
      lat: LATITUDE, //koordinat pemkab
      long: LONGITUDE, //koordinat pemkab
      dist:'~',
      profile_image: `${WebPath}/foto_profil/default.png`
    }

  }

  
  componentWillMount() {
  }
  
  enableAccessPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Izin Lokasi',
          'message': 'Aplikasi membutuhkan akses lokasi',
          'buttonPositive': 'Ok'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getLocation()
      } else {
        Toast.show({
          text:'Aplikasi membutuhkan akses lokasi.',
          position:'bottom',
          type:'danger',
          duration:5000
        })
        this.checkStatusLocation()
      }
    } catch(err) {
      return false
    }
  }

  componentDidMount = () => {
    this.props.navigation.addListener('willFocus', 
      () => {
        _this = this;
        this.getUserLogin()
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
          .then(data => {
            this.checkStatusLocation()
          }).catch(err => {
            alert("Error " + err.message + ", Code : " + err.code);
            RNExitApp.exitApp();
          }); 
        // Geolocation.getCurrentPosition(info => console.table(info));
        // // console.table(this.state.location);
      }
    )
  }

  checkStatusLocation = () => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(response => {
      if(response) {
        this.getLocation()
      } else {
        this.enableAccessPermission()
      }
    })

  }

  distance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "M") { dist = dist * 0.8684 }
    return dist.toFixed(3);
  }

  getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({location:location});
         let dist = this.distance(this.state.lat, this.state.long, this.state.location.latitude, this.state.location.longitude, "K");
         this.setState({ dist })
      },
      (error) => console.log(error.message),
      // (error) => Alert.alert('Peringatan!', 'Kesalahan mengambil lokasi, periksa GPS Anda'),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 0.1 });
      this.watchID = Geolocation.watchPosition(
        (lastPosition) => {
          const location = {
            latitude: lastPosition.coords.latitude,
            longitude: lastPosition.coords.longitude,
          };
        this.setState({ location:location });
        let dist = this.distance(this.state.lat, this.state.long, this.state.location.latitude, this.state.location.longitude, "K");
        
        this.setState({ dist })
      },
      // (error) => alert(JSON.stringify(error)),
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000,distanceFilter:0.1 });
  }

  getUserLogin = async () => {
      const user = await User.getUserLogin()
      this.setState({
        user: user,
      })
      await this.findApelOrIzinTodayByUserId(user.id)
      await this.getProfileImage()
  }

  getProfileImage = () => {
    this.setState({
      profile_image: `http://ia.simmon.web.id/foto/foto_blob_other/${this.state.user.pegawai.nip_baru}.jpeg`
    })
  }

  handleFotoNotFound = () => {
    this.setState({
      profile_image: `${WebPath}/foto_profil/default.png`
    })
  }

  findApelOrIzinTodayByUserId = async (userId) => {
    await APIApel.FindApelOrIzinTodayByUserId(userId)
            .then(res => {
              if(res.success) {
                this.setState({
                  apelData: res.data,
                  lastApelData: res.last_apel_data,
                  apelTodayExists: true,
                  spinner: false
                })
              } else {
                this.setState({
                  apelData: [],
                  lastApelData: res.last_apel_data,
                  apelTodayExists: false,
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
            })
  } 

  distToMeter=()=>{
    if (this.state.dist <= 1) {
      return (this.state.dist*1000).toString();
    }else{
      return (this.state.dist).toString();
    }
  }

  meterOrKilo=()=>{
    if (this.state.dist <= 1) {
      return <Text>Meter</Text>;
    } else {
      return <Text>Kilometer</Text>;
    }
  }

  textDistance = () => {
    if (this.state.dist > 0.1) { //jika jarak 0.1km atau 100m
      return <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Anda tidak berada pada lokasi Apel, lokasi Anda berjarak {this.distToMeter()} {this.meterOrKilo()}</Text>
    } else {
      return <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Saat ini Anda berada di lokasi apel, dengan jarak {this.distToMeter()} {this.meterOrKilo()}</Text>
    }
  }

  logout = async () => {
    await User.removeUserLogin()
    this.props.navigation.navigate('Auth')
  }

  changePassword = () => {
    this.props.navigation.navigate('ChangePasswordIndex')
  }

  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
  }
  render() {
    const showButtonApelAndIzin = this.state.apelTodayExists
    const showButtonApel = this.state.apelTodayExists && this.state.lastApelData.action_status == 'no-action' && this.state.lastApelData.apel_status == 'buka' && this.state.dist <= 0.1
    const showButtonIzin = this.state.apelTodayExists && this.state.lastApelData.izin_apel_status != 'tutup' && this.state.lastApelData.action_status == 'no-action' && this.state.dist > 0.1

    return ( 
      <Container>
        <Content>
        <NetInfo>
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={{color:'#FFF'}}
          />
            <ImageBackground source={require('../../assets/profile_background.jpg')} style={{ alignItems:'center', width: '100%', paddingBottom:20, paddingTop:20}}>
            {/* <Thumbnail large source={{uri: `http://ia.simmon.web.id/foto/foto_blob_other/${this.state.user.pegawai.nip_baru}.jpeg`}} onError={() => this.handleFotoNotFound()}/>  */}
            <Thumbnail large source={{uri: this.state.profile_image }} onError={() => this.handleFotoNotFound()}/> 
            <Text style={{fontSize: 20, fontWeight: 'bold', color:'black'}}>{this.state.user.name}</Text>
            <View style={{flexDirection:'row'}}>
              <Button 
                title="Rekap Apel"
                type="outline"
                buttonStyle={{padding:3, paddingTop:-2, marginTop:14, backgroundColor:'rgba(255, 255, 255, 0.8)'}}
                onPress={() => this.props.navigation.navigate('RekapAbsenIndex')}
              />
              { this.state.user.admin_satker && 
                <Button 
                  title="Statistik Peserta Apel"
                  type="outline"
                  buttonStyle={{padding:3, paddingTop:-2, marginTop:14, borderColor:'red', marginLeft:10, backgroundColor:'rgba(255, 255, 255, 0.8)'}}
                  titleStyle={{color:'red'}}
                  onPress={() => this.props.navigation.navigate('EselonIndex')}
                />
              }
            </View>
            </ImageBackground>
          <View style={{marginTop:10, borderBottomColor:'#dcdcdc', borderBottomWidth:1}}>
            <ListItem
              containerStyle={{padding:10}}
              title={this.state.user.pegawai.nip_baru}
              titleStyle={{color:'black'}}
              subtitle='Nomor Induk Pegawai'
              leftIcon={{name:'key', type:'font-awesome'}}
              topDivider={true}
            />

            <ListItem
              containerStyle={{padding:10}}
              title={this.state.user.pegawai.satuan_kerja}
              titleStyle={{color:'black'}}
              subtitle='Satuan Kerja'
              leftIcon={{name:'university', type:'font-awesome'}}
              topDivider={true}
            />

          </View>
          <View style={{margin:8}}>
            {this.state.apelData.map((val, key) => {
              // Ada apel dan ada action izin atau checkin
              if(val.action != undefined) {
                const textStatus = val.action_status == 'izin' ? 'Mengisi Izin' : 'Mengikuti Apel'
                const textMessage = val.action_status == 'izin' ? 'Terimakasih telah mengisi izin' : 'Terimakasih telah mengikuti apel'
              
                return (
                  <Card key={key} style={{padding:15}}>
                    <View style={{flexDirection:'row'}}>
                      <View style={{flex:1}}>
                        <Text style={{fontSize:14}}>{textStatus} {val.periode} Pada: {val.action.time_action}</Text>
                        <Text style={{fontWeight:'bold', fontSize:17}}>{textMessage}</Text>
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
                )
              } else {
                  // Ada apel dan status buka
                if(val.status == 'buka') {
                  return (
                    <Card key={key} style={{padding:15}}>
                      <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                          <Text style={{fontSize:14}}>Apel {val.periode} dilaksanakan pada: {val.jam_apel}</Text>
                          {this.textDistance()}
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
                  )
                  // Ada apel tetapi status tutup
                } else if(val.status == 'tutup') {
                  return (
                    <Card key={key} style={{padding:15}}>
                      <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                          <Text style={{fontSize:14}}>Apel {val.periode} dilaksanakan pada: {val.jam_apel}</Text>
                          <Text style={{fontWeight:'bold', fontSize:17}}>Telah melewati waktu checkin apel</Text>
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
                  )
                } else if(val.status == 'belum-mulai') {
                  return (
                    <Card key={key} style={{padding:15}}>
                      <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                          <Text style={{fontSize:14}}>Apel {val.periode} dilaksanakan pada: {val.jam_apel}</Text>
                          <Text style={{fontWeight:'bold', fontSize:17}}>Apel belum dimulai</Text>
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
                  )
                }
              }
            })}
            {/* Hari ini tidak ada apel */}
            { ! this.state.apelTodayExists &&
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
                    onPress={() => this.props.navigation.navigate('ApelIndex', {apelId: this.state.lastApelData.id})}
                    title="Hadir Apel"
                    type="outline"
                    buttonStyle={{borderColor:'#696969'}}
                    titleStyle={{color:'#696969'}}
                  />
                </View>
              }
              { showButtonIzin &&
                <View style={{flex:1, margin:5}}>
                  <Button
                    onPress={() => this.props.navigation.navigate('IzinIndex', {apelId: this.state.lastApelData.id})}
                    title="Izin Apel"
                    type="outline"
                    buttonStyle={{borderColor:'#696969'}}
                    titleStyle={{color:'#696969'}}
                  />
                </View>
              }
            </View>
          }
        </NetInfo>
        </Content>
      </Container>
    )
  }
}

