import React, {Component} from 'react'
import APILogin from '../../services/login'
import { User } from '../../storage/async-storage'
import Spinner from 'react-native-loading-spinner-overlay'
import { Text, View, KeyboardAvoidingView, Image } from 'react-native'
import { Container, Item, Input, Icon, Button, Card, CheckBox, Toast } from 'native-base'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      spinner: false,

      remember_me: false,
      username:'',
      password:'',

      validation: {
        username:'',
        password:'',
      }
    }
  }

  toggleRememberMe = () => {
    this.setState({
      remember_me: !this.state.remember_me
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
        <View style={{flex:1, paddingHorizontal:5, justifyContent:'center'}}>
          <KeyboardAvoidingView behavior="padding">
            <View style={{justifyContent:'center', flexDirection:'row'}}>
              <Image
                style={{width:80, height:80}}
                source={require('../../assets/icons/fingerprint.jpg')}
                />
            </View>
            <Card style={{paddingHorizontal:10, paddingVertical:10, marginTop:10}}>
              <View style={{justifyContent: 'center', marginBottom:20, flexDirection:'row'}}>
                <Text style={{fontSize:16, textAlign:'center'}}>
                  Aplikasi {"\n"}
                  E-Izin & E-Apel {"\n"}
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
                <Input placeholder='NIK Pegawai' onChangeText={(username) => this.setState({username})}/>
              </Item>
              <Text style={{color:'red'}}>{this.state.validation.username}</Text>
              <Item error={hasErrorPassword}>
                <Icon active name='lock' />
                <Input secureTextEntry placeholder='Password' onChangeText={(password) => this.setState({password})}/>
              </Item>
              <Text style={{color:'red'}}>{this.state.validation.password}</Text>
              <View style={{marginTop:10, flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <CheckBox checked={this.state.remember_me} onPress={this.toggleRememberMe} style={{marginRight:15}} />
                  <Text>Remember Me</Text>
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
      password: this.state.password
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
                  type:'danger'
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
                  type:'danger'
                })
              }
              this.setState({
                spinner: false
              })
            })
  }
}