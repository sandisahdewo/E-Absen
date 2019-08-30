import React,{Component} from 'react'
import {View, Text, KeyboardAvoidingView} from 'react-native'
import {Container, Content, Item, Input, Button, Icon} from 'native-base'
import { User } from '../../storage/async-storage'

export default class Index extends Component {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#808080',
    title: 'Ganti Password',
  };

  constructor(props) {
    super(props)

    this.state = {
      user: {
        pegawai: {}
      },

      password: '',
      password_confirmation: '',

      showPassword: '',
      showPasswordConfirmation: '',

      validation: {
        password: '',
        password_confirmation: ''
      }
    }
  }

  componentDidMount = () => {
    this.getUserLogin()
  }

  getUserLogin = async () => {
    const user = await User.getUserLogin()
    this.setState({
      user: user
    })
  }

  toggleHideShowPassword = (field) => {
    if(field == 'password') {
      this.setState({
        showPassword: !this.state.showPassword
      })
    } else if(field == 'password_confirmation') {
      this.setState({
        showPasswordConfirmation: !this.state.showPasswordConfirmation
      })
    }
  }

  render() {
    const hasErrorPassword = this.state.validation.password ? true : false;
    const hasErrorPasswordConfirmation = this.state.validation.password_confirmation ? true : false;

    return(
      <Container>
        <Content style={{padding:15}}>
          <KeyboardAvoidingView behavior="padding">
            <Item>
              <Input placeholder='ID Mesin' value={this.state.user.username} disabled/>
            </Item>

            <Item>
              <Input placeholder='Nama' value={this.state.user.pegawai.nama_lengkap} disabled/>
            </Item>

            <Item error={hasErrorPassword}>
              <Input secureTextEntry={!this.state.showPassword} placeholder='Password Baru' onChangeText={(password) => this.setState({password})}/>
              <Button transparent iconLeft dark onPress={() => this.toggleHideShowPassword('password')}>
                <Icon name={this.state.showPassword ? 'eye' : 'eye-off'}/>
              </Button>
            </Item>
            { hasErrorPassword &&
              <Text style={{color:'red'}}>{this.state.validation.password}</Text>
            }

            <Item error={hasErrorPasswordConfirmation}>
              <Input secureTextEntry={!this.state.showPasswordConfirmation} placeholder='Konfirmasi Password Baru' onChangeText={(password_confirmation) => this.setState({password_confirmation})}/>
              <Button transparent iconLeft dark onPress={() => this.toggleHideShowPassword('password_confirmation')}>
                <Icon iconStyle={{size:10}} name={this.state.showPasswordConfirmation ? 'eye' : 'eye-off'}/>
              </Button>
            </Item>
            {hasErrorPasswordConfirmation &&
              <Text style={{color:'red'}}>{this.state.validation.password_confirmation}</Text>
            }
            
            <View style={{paddingTop:10}}>
              <Button success block>
                <Text style={{color:'white'}}>Perbarui</Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
        </Content>
      </Container>
    )
  }
}