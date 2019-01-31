/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import TabNavigator  from 'react-native-tab-navigator';
import Index from './home/Index';
import Add from './add/Index';
import Detail from './home/Detail';
import Square from './square/Index';
export default class App extends Component<{}> {
  static navigationOptions = {
    header:null,
  };
  constructor(props){
      super(props);
      this.state={
        selectedTab:'home'
      };
      navigation = this.props.navigation;
  }
  render() {
    return (
      <TabNavigator>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'home'}
          onPress={()=>this.setState({selectedTab:'home'})}
          title={'首页'}
          renderIcon={() => <Image style={styles.icon} source={require('./images/note_default.png')} />}
          renderSelectedIcon={() => <Image style={styles.icon} source={require('./images/note.png')} />}
        >
          <Index navigation={navigation}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'add'}
          onPress={()=>this.setState({selectedTab:'add'})}
          title={'写便签'}
          renderIcon={() => <Image style={styles.add} source={require('./images/add_default.png')} />}
          renderSelectedIcon={() => <Image style={styles.add} source={require('./images/add.png')} />}
        >
        <Add navigation={navigation}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'square'}
          onPress={()=>this.setState({selectedTab:'square'})}
          title={'广场'}
          renderIcon={() => <Image style={styles.icon} source={require('./images/square_default.png')} />}
          renderSelectedIcon={() => <Image style={styles.icon} source={require('./images/square.png')} />}
        >
        <Square navigation={navigation}/>
        </TabNavigator.Item>
      </TabNavigator>
    )
  }
}

const styles = StyleSheet.create({
  icon:{
    height:30,
    width:30
  },
  add:{
    width: 40,
    height: 40
  }
});
