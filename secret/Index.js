/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  AsyncStorage
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
      value: false,
     };
  }
  _send_msg(){
    var that =this;
    var url = Fn.requestUrl+'notes/Secret';
    var note_id=this.props.navigation.state.params.note_id;
    var user_id=this.props.navigation.state.params.user_id;
    var note_user=this.props.navigation.state.params.note_user;
    var message = this.state.message;
    var params ={
      note_id:note_id,
      note_user_id:note_user,
      feedback_user_id:user_id,
      message:message,
      feedback_show:this.state.value,
    }
    Fn.postRequest(url,params,function(data){
      if (data==1) {
        var show = false;
        that.props.navigation.goBack();
        that.props.navigation.state.params.callback(show);
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavTopBar
        name='悄悄话'
        left={true}
        goback={Fn._goback.bind(this)}
        right={true}
        right_icon={require('../images/release.png')}
        jump={this._send_msg.bind(this)}
        />
        <TextInput
          multiline={true}
          maxLength={120}
          placeholder={'你想对他／她说点什么？'}
          style={styles.secret_input}
          onChangeText={(message)=>this.setState({message:message})}
         />
         <View style={styles.secret_num}>
          <Text style={styles.secret_foot}>字数限制:</Text>
          <Text style={styles.secret_foot}>120</Text>
         </View>
         <View style={styles.secret_switch}>
            <Text style={styles.secret_txt}>是否匿名提交</Text>
            <Switch
                value={this.state.value}
                onValueChange={(value)=>{this.setState({value: value})}}
            />
         </View>
      </View>
    );
  }
}
