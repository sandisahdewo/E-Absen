import React, {Component} from 'react'
import APILogin from '../../services/login'
import { User } from '../../storage/async-storage'
import Spinner from 'react-native-loading-spinner-overlay'
import { Text, View, KeyboardAvoidingView, Image, PermissionsAndroid, BackHandler, DeviceEventEmitter } from 'react-native'
import { Container, Item, Input, Icon, Button, Card, Toast } from 'native-base'
import NetInfo from '../../components/netinfo'
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      spinner: false,

      remember_me: false,
      username:'',
      password:'',
      showPassword: false,

      validation: {
        username:'',
        password:'',
      },

      imei: ''
    }
  }

  componentDidMount = () => {
     this.requestPhonePermission()
     this.requestEnableLocation()
  }


  requestEnableLocation =  () => {
    //  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
    // .then(data => {
    //   // The user has accepted to enable the location services
    //   // data can be :
    //   //  - "already-enabled" if the location services has been already enabled
    //   //  - "enabled" if user has clicked on OK button in the popup
    // }).catch(err => {
    //   // The user has not accepted to enable the location services or something went wrong during the process
    //   // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
    //   // codes : 
    //   //  - ERR00 : The user has clicked on Cancel button in the popup
    //   //  - ERR01 : If the Settings change are unavailable
    //   //  - ERR02 : If the popup has failed to open
    // });
  }

  requestPhonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE, {
          'title': 'Aplikasi memerlukan akses ke telepon.',
          'message': 'Izinkan untuk dapat menggunakan aplikasi.',
          'buttonPositive': 'OK'
        }
      )
      if(granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('permission granted')
        this.getImei()
      } else {
        console.log('permission not granted')
      }
    } catch (error) {
      console.warn(error)
    }
  }

  getImei = () => {
    const IMEI = require('react-native-imei');
    IMEI.getImei().then(imeiList => {
      this.setState({
        imei: imeiList[0]
      })
    });
  }

  toggleRememberMe = () => {
    this.setState({
      remember_me: !this.state.remember_me
    })
  }

  toggleHideShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

  render() {
    const hasErrorUsername = this.state.validation.username ? true : false;
    const hasErrorPassword = this.state.validation.password ? true : false;

    return (
      <Container>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color:'#FFF'}}
        />
        <NetInfo>
          <View style={{flex:1, paddingHorizontal:5, justifyContent:'center'}}>
            <KeyboardAvoidingView behavior="padding">
              <View style={{justifyContent:'center', flexDirection:'row'}}>
                <Image
                  style={{width:110, height:143}}
                  source={require('../../assets/icons/logo_kab_probolinggo.png')}
                  />
              </View>
              <Card style={{paddingHorizontal:10, paddingVertical:10, marginTop:10}}>
                <View style={{justifyContent: 'center', marginBottom:20, flexDirection:'row'}}>
                  <Text style={{fontSize:16, textAlign:'center'}}>
                    Aplikasi e-Apel {"\n"}
                    Pemerintah Kabupaten Probolinggo
                  </Text>
                </View>
                <View style={{justifyContent: 'center', flexDirection:'row'}}>
                  <Text style={{fontSize:20, fontWeight:'bold', marginBottom:10, textAlign:'center'}}>
                    LOGIN
                  </Text>
                </View>
                <Item error={hasErrorUsername}>
                  <Icon active name='person' />
                  <Input placeholder='ID Mesin' onChangeText={(username) => this.setState({username})}/>
                </Item>
                <Text style={{color:'red'}}>{this.state.validation.username}</Text>
                <Item error={hasErrorPassword}>
                  <Icon active name='lock' />
                  <Input secureTextEntry={!this.state.showPassword} placeholder='Password' onChangeText={(password) => this.setState({password})}/>
                  <Button iconLeft dark transparent onPress={() => this.toggleHideShowPassword()}>
                    <Icon name={this.state.showPassword ? 'eye' : 'eye-off'}/>
                  </Button>
                </Item>
                <Text style={{color:'red'}}>{this.state.validation.password}</Text>
                <Item>
                  <Icon active name='barcode' />
                  <Input value={this.state.imei} disabled/>
                </Item>
                <View style={{marginTop:10, flexDirection:'row', justifyContent:'space-between'}}>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    {/* <CheckBox checked={this.state.remember_me} onPress={this.toggleRememberMe} style={{marginRight:15}} />
                    <Text>Remember Me</Text> */}
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Button block info style={{backgroundColor:"#2089dc", height:40, paddingHorizontal:20}}
                      onPress={() => this.login()}
                    >
                      <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}> Masuk </Text>
                    </Button>
                  </View>
                </View>
              </Card>
            </KeyboardAvoidingView>
          </View>
        </NetInfo>
      </Container>
    );
  }

  login = async () => {
    this.setState({
      validation: {},
      spinner: true
    })
    const formData = {
      username: this.state.username,
      password: this.state.password,
      imei: this.state.imei
    }
    
    await APILogin.Attempt(formData)
            .then(res => {
              if(res.success) {
                Toast.show({
                  text: 'Login berhasil!',
                  buttonText: 'Okay',
                  type:'success'
                })
                this.setState({
                  spinner: false
                })
                User.setUserLogin(res.user)
                this.props.navigation.navigate('ProfileIndex')
              } else {
                Toast.show({
                  text: res.message,
                  buttonText: 'Oops',
                  type:'danger',
                  duration: 5000
                })
                this.setState({
                  spinner: false
                })
              }
            })
            .catch(err => {
              if(err.hasOwnProperty('response')) {
                if(err.response.status == 422) {
                  const errorItem = err.response.data.errors;
                  this.setState({
                    validation: {
                      username: errorItem.username,
                      password: errorItem.password,
                    }
                  })
                }
              } else {
                Toast.show({
                  text: err.message,
                  buttonText: 'Oops',
                  type:'danger',
                  duration: 5000
                })
              }
              this.setState({
                spinner: false
              })
            })
  }
}