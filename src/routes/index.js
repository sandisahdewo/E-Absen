import React from 'react'

import Login from '../pages/login'
import ProfileIndex from '../pages/profile'
import ApelIndex from '../pages/e-apel'
import IzinIndex from '../pages/e-izin'
import EselonIndex from '../pages/e-eselon'

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
  EselonIndex: {
    screen: EselonIndex
  },
})

const AppSwitch = createSwitchNavigator({
  App: PageStack,
  Auth: LoginStack
}, {
  initialRouteName: 'App'
})

const Navigator = createAppContainer(AppSwitch)

export default Navigator;