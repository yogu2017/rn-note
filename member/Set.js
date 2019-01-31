/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import styles from '../style/Style';
import Fn from '../function/Fun';
import NavTopBar from '../common/NavTopBar';

export default class Index extends Component {
  static  navigationOptions = {
   header:null,
   gesturesEnabled:true,
   //gestureResponseDistance:{horizontal:300},
 };
  constructor(props) {
  super(props);
  this.state = {

     };
  }
  render() {
    return (
      <View style={styles.container}>
        <NavTopBar
        name='设置'
        left={true}
        goback={Fn._goback.bind(this)}
        />
      </View>
    );
  }
}
