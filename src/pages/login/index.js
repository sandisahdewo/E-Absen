import React, {Component} from 'react';
import {
  Text, View, KeyboardAvoidingView, Image
} from 'react-native';
import { Container, Item, Input, Icon, Button, Card, CheckBox } from 'native-base';

export default class Index extends Component {

  state = {
    remember_me: false
  }

  toggleRememberMe = () => {
    this.setState({
      remember_me: !this.state.remember_me
    })
  }

  render() {
    return (
      <Container>
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
              <Item>
                <Icon active name='person' />
                <Input placeholder='NIK Pegawai'/>
              </Item>
              <Item>
                <Icon active name='lock' />
                <Input placeholder='Password'/>
              </Item>
              <View style={{marginTop:10, flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <CheckBox checked={this.state.remember_me} onPress={this.toggleRememberMe} style={{marginRight:15}} />
                  <Text>Remember Me</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Button block info style={{backgroundColor:"#2089dc", height:40, paddingHorizontal:20}}
                  onPress={() => this.props.navigation.navigate('ProfileIndex')}
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
}