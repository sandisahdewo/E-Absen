import React, {Component} from 'react'
import {View, Text} from 'react-native'
import NetInfo from '@react-native-community/netinfo'

class NetworkInformation extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      isConnected: true
    }
  }

  componentDidMount = () => {
    this.checkIsConnected()
  }

  checkIsConnected = () => {
    NetInfo.addEventListener(state => {
      this.setState({isConnected:state.isConnected})
    })
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.state.isConnected &&
          this.props.children
        }
        {!this.state.isConnected &&
          <View style={{height:20, backgroundColor:'red', justifyContent:'center', alignItems:'center'}}>
            <Text style={{color:'#FFFE'}}>Tidak ada koneksi internet</Text>
          </View>
        }
      </View>
    )
  }
}

export default NetworkInformation