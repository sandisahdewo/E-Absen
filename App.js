import React, { Component } from 'react';
import Router from './src/routes'
import { Root } from 'native-base';

export default class App extends Component {
  render() {
    return (
      <Root>
        <Router/>
      </Root>
    )
  }
}