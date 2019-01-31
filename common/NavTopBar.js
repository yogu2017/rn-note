/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import styles from '../style/Style';
export default class NavTopBar extends Component {
  constructor(props) {
  super(props);
  this.state = {

     };
  }
  render() {
    return (
        <View style={styles.head}>
          <View style={styles.headwidth}>
          {this.props.left?(<TouchableOpacity onPress={this.props.goback}>
            <Image
                source={require('../images/left.png')}
                style={styles.headTopLeft}
              />
            </TouchableOpacity>):null}
            </View>
          <View style={styles.headwidth}><Text style={styles.headtitle}>{this.props.name}</Text></View>
          <View style={styles.headwidth}>
          {this.props.right?(<TouchableOpacity
            onPress={this.props.jump}
            >
            <Image
              source={this.props.right_icon}
              style={styles.headTopRight}
            />
            </TouchableOpacity>):null}
            </View>
        </View>
    );
  }
}
