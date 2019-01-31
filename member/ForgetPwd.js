/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';
import styles from '../style/Style';
import Fn from '../function/Fun';
export default class ForgetPwd extends Component {
  constructor(props) {
  super(props);
  this.state = {
    phonenum:'',
    codeText:'获取验证码',
    inputCode:'',
    password:'',
    code:'',
    num:60
     };
  }
  static  navigationOptions = {
   header:null,
   gesturesEnabled:true,
   //gestureResponseDistance:{horizontal:300},
 };
 //验证码事件
 _sendCode(){
   var that =this;
   var codeText = this.state.codeText;
   if (codeText != '获取验证码') {
     return;
   }
   var phone = this.state.phonenum;
   if (phone==''||phone.length<11) {
    Fn.showToast('手机号输入有误，请检查后重试');
     return;
   }
   var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
   if (!myreg.test(phone)) {
     Fn.showToast('手机号码格式不正确');
     return false;
   }
   let code = Fn.creatCode(6);
   this.setState({
     code:code
   })
   if (code.length==6) {
     var num = this.state.num;
     this.timer = setInterval(function(){
       that.setState({
         num:num-1
       })
       num--;
       if (num<=0) {
         clearInterval(this.timer);
         that.setState({codeText:'获取验证码'})
       }else{
         that.setState({codeText:num+'秒后可重试'})
       }
     },1000)
   }
   alert(code)
 }
 _onPressFog(){
   var that =this;
   var phonenum = this.state.phonenum;
   var inputCode = this.state.inputCode;
   var code = this.state.code;
   var password = this.state.password;
   var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
   if(!phonenum || !inputCode){
     Fn.showToast('手机号和验证码不能为空');
     //this.refs.toast.show('手机号和验证码不能为空',800);
     return;
   }
   if (!myreg.test(phonenum)) {
     Fn.showToast('手机号码格式不正确');
     //this.refs.toast.show('手机号码格式不正确',800);
     return false;
   }
   if (code!=inputCode) {
     Fn.showToast('验证码输入错误，请重新输入');
     //this.refs.toast.show('验证码输入错误，请重新输入',800);
     return;
   }
   if (password.length<6) {
     Fn.showToast('密码不能少于6位数');
     //this.refs.toast.show('请输入6位数以上密码',800);
     return;
   }
   var url = Fn.requestUrl+'user/ForgetPwd';
   var params = {
     phonenum:phonenum,
     password:password
   }
   Fn.postRequest(url,params,function(data){
     if(data==1){
       Fn.showToast('密码已修改，请使用新密码登录');
       that.props.navigation.goBack();
     }else if(data==2){
       Fn.showToast('新密码与原密码重复');
     }else{
       Fn.showToast('手机号不存在，请修改后重试');
     }
   })
   //Fn.showToast(url);
 }
 componentWillUnmount(){
     clearInterval(this.timer);
 }
  render() {
    const {navigate} = this.props.navigation;
    return (
        <View style={styles.container}>
          <Image  source={require('../images/bg.png')} style={styles.bg} />
          <View style={[styles.login_center,styles.center]}>
            <View style={styles.login_title}>
              <Text style={styles.login_txt}>Q-Note</Text>
            </View>
            <View style={styles.login_inputView}>
              <Image
                source={require('../images/account.png')}
                style={styles.inputImg}
              />
              <TextInput
              placeholder='请输入手机号'
              maxLength={11}
              keyboardType='numeric'
              placeholderTextColor='#fff'
              underlineColorAndroid="transparent"
              style={styles.login_input}
              onChangeText={(phonenum)=>this.setState({
                phonenum:phonenum
              })}
               />
            </View>
            <View style={styles.login_inputView}>
              <Image
                source={require('../images/code.png')}
                style={styles.inputImg}
              />
              <TextInput
              placeholder='请输入验证码'
              keyboardType='numeric'
              placeholderTextColor='#fff'
              maxLength={6}
              underlineColorAndroid="transparent"
              style={styles.login_input}
              onChangeText={(inputCode)=>this.setState({
                inputCode:inputCode
              })}
               />
               <TouchableOpacity
                activeOpacity={0.8}
                onPress={this._sendCode.bind(this)}
                style={styles.login_forget}>
                <Text style={{color:'#fff'}}>{this.state.codeText}</Text>
               </TouchableOpacity>
            </View>
            <View style={styles.login_inputView}>
              <Image
                source={require('../images/password.png')}
                style={styles.inputImg}
              />
              <TextInput
              placeholder='请输入密码6-12位'
              secureTextEntry={true}
              placeholderTextColor='#fff'
              maxLength={12}
              underlineColorAndroid="transparent"
              style={styles.login_input}
              onChangeText={(password)=>this.setState({
                password:password
              })}
               />
            </View>
            <TouchableOpacity
              style={styles.login_btn}
              activeOpacity={0.8}
              onPress={this._onPressFog.bind(this)}
              >
              <Text style={{fontSize: 18,color: '#fff',fontWeight: 'bold'}}>找回密码</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
          activeOpacity={0.8}
          onPress={()=>this.props.navigation.goBack()}
           style={styles.login_reg}>
            <Text style={styles.login_reg_txt}>想到了密码？去登录。</Text>
          </TouchableOpacity>
        </View>
    );
  }
}
