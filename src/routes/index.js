import React from 'react'

import Login from '../pages/login'
import ProfileIndex from '../pages/profile'
import ApelIndex from '../pages/e-apel'
import IzinIndex from '../pages/e-izin'

import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

const LoginStack = createStackNavigator({
  Login: {
    screen: Login,
  }
}, {
  headerMode: 'none'
})

const PageStack = createStackNavigator({
  ProfileIndex: {
    screen: ProfileIndex
  },
  IzinIndex: {
    screen: IzinIndex
  },
  ApelIndex: {
    screen: ApelIndex
  },
})

const AppSwitch = createSwitchNavigator({
  App: PageStack,
  Auth: LoginStack
}, {
  initialRouteName: 'Auth'
})

const Navigator = createAppContainer(AppSwitch)

export default Navigator;