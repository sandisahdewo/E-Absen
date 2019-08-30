import React from 'react'

import Login from '../pages/login'
import Splash from '../pages/splash'
import ProfileIndex from '../pages/profile'
import ApelIndex from '../pages/e-apel'
import IzinIndex from '../pages/e-izin'
import EselonIndex from '../pages/e-eselon'
import RekapAbsenIndex from '../pages/rekap-absen'
import ChangePasswordIndex from '../pages/change-password'

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
  RekapAbsenIndex: {
    screen: RekapAbsenIndex
  },
  ChangePasswordIndex: {
    screen: ChangePasswordIndex
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
  Splash: Splash,
  App: PageStack,
  Auth: LoginStack
}, {
  initialRouteName: 'Splash'
})

const Navigator = createAppContainer(AppSwitch)

export default Navigator;