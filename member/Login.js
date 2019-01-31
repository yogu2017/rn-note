/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import Fn from '../function/Fun';
import styles from '../style/Style';
export default class Login extends Component {
  constructor(props) {
  super(props);
  this.state = {
    phonenum:'',
    password:'',
     };
  }
  static  navigationOptions = {
   header:null,
   gesturesEnabled:true,
   //gestureResponseDistance:{horizontal:300},
 };
  componentDidMount(){

  }
  _onPressLogin(){
    var that = this;
    var phonenum = this.state.phonenum;
    var password = this.state.password;
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phonenum)) {
      Fn.showToast('手机号码不正确')
      return false;
    }
    if (password=='') {
      Fn.showToast('密码不能为空')
      return false;
    }
    var url = Fn.requestUrl+'user/Login';
    var params={
      phonenum:phonenum,
      password:password
    }
    Fn.postRequest(url,params,function(data){
      if(data==1){
        Fn.showToast('登录成功');
        try {
          AsyncStorage.setItem('phonenum',phonenum);
        } catch (e) {
          console.log(e);
        }
        that.props.navigation.goBack();
        that.props.navigation.state.params.callback();
      }else if(data==0){
        Fn.showToast('密码错误')
      }else if(data==2){
        Fn.showToast('账号不存在')
      }else{
        Fn.showToast('登录超时，请重试')
      }
    })
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
            placeholder='请输入账号/手机号'
            placeholderTextColor='#fff'
            maxLength={11}
            keyboardType='numeric'
            underlineColorAndroid="transparent"
            style={styles.login_input}
            onChangeText={(phonenum)=>this.setState({
              phonenum:phonenum
            })}
             />
          </View>
          <View style={styles.login_inputView}>
            <Image
              source={require('../images/password.png')}
              style={styles.inputImg}
            />
            <TextInput
            placeholder='请输入密码'
            placeholderTextColor='#fff'
            secureTextEntry={true}
            maxLength={12}
            underlineColorAndroid="transparent"
            style={styles.login_input}
            onChangeText={(password)=>this.setState({
              password:password
            })}
             />
             <TouchableOpacity
              activeOpacity={0.8}
              onPress={()=>navigate('ForgetPwd')}
              style={styles.login_forget}>
              <Text style={{color:'#fff'}}>忘记密码？</Text>
             </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={this._onPressLogin.bind(this)}
            style={styles.login_btn}
            activeOpacity={0.8}
            >
            <Text style={{fontSize: 18,color: '#fff',fontWeight: 'bold'}}>登录</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>navigate('Register')}
         style={styles.login_reg}>
          <Text style={styles.login_reg_txt}>还没有账户？去注册。</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
