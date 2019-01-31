/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  AsyncStorage,
  Image,
  Alert,
  TouchableOpacity
} from 'react-native';
import styles from '../style/Style';
import Fn from '../function/Fun';
import NavTopBar from '../common/NavTopBar';
export default class Index extends Component {
  constructor(props) {
  super(props);
  this.state = {
    nick_name:''
     };
  }
  static  navigationOptions = {
   header:null,
   gesturesEnabled:true,
   //gestureResponseDistance:{horizontal:300},
 };
 loginout(){
   try {
    AsyncStorage.removeItem('phonenum', (error)=>{
        if(!error){
            Fn.showToast('退出成功');
            this.props.navigation.state.params.callback();
            this.props.navigation.goBack();
                    }
                }
            )
        }catch (error){
            alert('失败',+error);
        }
 }
 _outLogin(){
   Alert.alert(
     '确定退出吗？',
     '',
     [
       {text: '确定', onPress: () =>
       this.loginout()
     },
       {text: '取消', onPress: () => console.log('OK Pressed')},
     ],
     { cancelable: false }
 )
 }
 _getMember_info(){
   AsyncStorage.getItem('phonenum',(error,phonenum)=>{
     var that = this;
     var params = {user_id:phonenum}
     var url = Fn.requestUrl+'user/Index';
     Fn.postRequest(url,params,function(data){
       if (data!=0) {
         that.setState({
           nick_name:data[0].nickname,
           avator:Fn.requestUrl+data[0].avator,
           data:data[0]
         })
       }
       //alert(JSON.stringify(data))
     })
   })
 }
 componentDidMount(){
   var user_id = this.props.navigation.state.params.user_id;
   this.setState({user_id:user_id})
   this._getMember_info()

 }
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <NavTopBar
        name='个人中心'
        left={true}
        goback={Fn._goback.bind(this)}
        />
        <View style={styles.member_avator_view}>
          <Image style={styles.member_avator} source={{uri:this.state.avator}}/>
          <Text style={styles.member_list_info}>{this.state.nick_name}</Text>
        </View>
        <View style={styles.member_body}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=>navigate('ModUserInfo',{
                    info:this.state.data,
                    callback:()=>{
                       this._getMember_info()
                   }
            })}
            style={styles.member_list}
            >
            <Image source={require('../images/info.png')} style={styles.member_list_icon} />
            <Text style={styles.member_list_info}>我的资料</Text>
            <Image source={require('../images/arrow.png')} style={styles.member_list_arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=>navigate('MyMsg',{
                    user_id:this.state.user_id,
                  
            })}
            style={styles.member_list}
            >
            <Image source={require('../images/mymsg.png')} style={styles.member_list_icon} />
            <Text style={styles.member_list_info}>我的悄悄话</Text>
            <Image source={require('../images/arrow.png')} style={styles.member_list_arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=>navigate('Recycle',{
                    user_id:this.state.user_id
            })}
            style={styles.member_list}
            >
            <Image source={require('../images/recycle.png')} style={styles.member_list_icon} />
            <Text style={styles.member_list_info}>便签回收站</Text>
            <Image source={require('../images/arrow.png')} style={styles.member_list_arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=>navigate('MyNote',{
                    user_id:this.state.user_id
            })}
            style={styles.member_list}
            >
            <Image source={require('../images/about.png')} style={styles.member_list_icon} />
            <Text style={styles.member_list_info}>我的Q便签</Text>
            <Image source={require('../images/arrow.png')} style={styles.member_list_arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=>navigate('Set',{
                    user_id:this.state.user_id
            })}
            style={styles.member_list}
            >
            <Image source={require('../images/set.png')} style={styles.member_list_icon} />
            <Text style={styles.member_list_info}>设置</Text>
            <Image source={require('../images/arrow.png')} style={styles.member_list_arrow} />
          </TouchableOpacity>
        </View>
        <Button
        onPress={this._outLogin.bind(this)}
        title="退出登录"
         />
      </View>

    );
  }
}
