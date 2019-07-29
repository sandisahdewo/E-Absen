import React, {Component} from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import {User} from '../../storage/async-storage/index'

export default class Index extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount = () => {
    this.checkUserHasLogin()
  }

  checkUserHasLogin = async () => {
    let user = await User.getUserLogin()
    if(user) this.props.navigation.navigate('App')
    else this.props.navigation.navigate('Auth')
  }

  render() {
    return (
      <View style={{flex:1, justifyContent:'center'}}>
        <ActivityIndicator/>
      </View>
    )
  }
}