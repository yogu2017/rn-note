/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Image
} from 'react-native';
import styles from '../style/Style';
import Fn from '../function/Fun';
import NavTopBar from '../common/NavTopBar';
import Swipeout from 'react-native-swipeout';
export default class Index extends Component {
  static  navigationOptions = {
   header:null,
   gesturesEnabled:true,
   //gestureResponseDistance:{horizontal:300},
 };
  constructor(props) {
  super(props);
  this.state = {
    show:false,
    swipeoutBtns :[
         {text: '删除',type: 'delete',autoClose: true,onPress: ()=>{this.deleteItem()}},
         {text: '恢复',type: 'primary'},
       ]
     };

  }
  deleteItem(){
    alert('del')
  }
  _getMember_msg(){
    var that = this;
    var user_id = this.props.navigation.state.params.user_id;
    var url = Fn.requestUrl+'user/Recycle';
    var params={user_id:user_id};
    Fn.postRequest(url,params,function(data){
      if(data!=0){
        that.setState({
          data:data
        })
      }else{
        that.setState({show:true})
      }
    })
  }
  _keyExtractor = (item, index) => index;
  _renderItem = ({item}) => (

    <View style={styles.notice_body}>
    <Swipeout style={styles.swipeout} right={this.state.swipeoutBtns}>
      <View style={styles.notice_head}>
      <Image
        style={styles.square_view_avator}
        source={{uri:Fn.requestUrl+item.avator}}
       />
        <View style={styles.notice_uesr_info}>
          <Text style={styles.notice_time}>{Fn.change(item.time)}</Text>
        </View>
      </View>
      <View style={styles.notice_detail}>
        <Text style={styles.note_d_txt}>  {item.note_content}</Text>
      </View>
      </Swipeout>
    </View>
  );
  componentDidMount(){
    this._getMember_msg()
  }
  render() {
    return (
      <View style={styles.container}>
        <NavTopBar
        name='便签回收站'
        left={true}
        goback={Fn._goback.bind(this)}
        />
        {this.state.show?(
          <View >
            <Text>回收站是空的哦!</Text>
          </View>
        ):(
          <FlatList
            refreshing ={true}
            data={this.state.data}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
           />
        )}

      </View>
    );
  }
}
