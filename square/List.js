/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  AsyncStorage,
  TouchableOpacity,
  Animated
} from 'react-native';
import styles from '../style/Style';
import Fn from '../function/Fun';
import NavTopBar from '../common/NavTopBar';
export default class List extends Component {
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
  componentDidMount(){
    AsyncStorage.getItem('phonenum',(error,phonenum)=>{
      var that = this;
      var url = Fn.requestUrl+'user/Notice';
      var params={user_id:phonenum}
      Fn.getRequest(url,params,function(data){
        that.setState({data:data})
      //  alert(data)
      })
    })
  }
  _keyExtractor = (item, index) => item.id;
  _renderItem = ({item}) => (
    <View style={styles.notice_body}>
      <View style={styles.notice_head}>
        <Image
          style={styles.square_view_avator}
          source={{uri:'https://img3.duitang.com/uploads/item/201512/25/20151225132409_NKFCh.jpeg'}}
         />
        <View style={styles.notice_uesr_info}>
          <Text style={styles.notice_user}>{item.feedback_show==1?('已匿名'):item.feedback_user_id}</Text>
          <Text style={styles.notice_time}>{Fn.change(item.time)}</Text>
        </View>
      </View>
      <View style={styles.notice_detail}>
        <Text style={styles.note_d_txt}>  {item.message}</Text>
      </View>
    </View>
  );
  render() {
    return (
      <View style={styles.container}>
        <NavTopBar
        name='我的悄悄话'
        left={true}
        goback={Fn._goback.bind(this)}
        />
        <FlatList
          refreshing ={true}
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
         />
      </View>
    );
  }
}
