/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Button
} from 'react-native';
import styles from '../style/Style';
import Fn from '../function/Fun';
import NavTopBar from '../common/NavTopBar';
import ActionSheet from 'react-native-actionsheet';
import  ImagePicker from 'react-native-image-picker'; //第三方相机
import DatePicker from 'react-native-datepicker';
const options = [ '取消','保密','男', '女'];
export default class Index extends Component {
  static  navigationOptions = {
   header:null,
   gesturesEnabled:true,
   //gestureResponseDistance:{horizontal:300},
 };
  constructor(props) {
  super(props);
  this.state = {
      datetime:"2018-01-01",
      visible: false,
      visibleemail: false,
      info:[]
     };
  }
  handlePress(index) {
    if (index==0) {
      return
    }
    this.setState({
      sexcode:index,
      sex:options[index],
      img_url:''
    })
  }
  _upload(){
    var img_url = this.state.img_url;
    var user_id = this.state.user_id;
    var uploadURL = Fn.requestUrl+'user/upload';
     let formData = new FormData();//如果需要上传多张图片,需要遍历数组,把图片的路径数组放入formData中
     let file = {uri: img_url, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,
     formData.append("files",file);   //这里的files就是后台需要的key
    //alert(this.state.img_url)
    fetch(uploadURL,{
         method:'POST',
         headers:{
             'Content-Type':'multipart/form-data',
         },
         body:formData,
     })
         .then((response) => response.json() )
         .then((data)=>{
             var img_url = data.files.files.url;
             var headimg = Fn.requestUrl+img_url;
             this.setState({img_url:img_url});
             Fn.showToast('头像上传成功');
             //that.props.navigation.state.params.callback();
             console.log('responseData',data);
         })
         .catch((error)=>{console.error('error',error)
           alert(error)
           });
  }
  cameraAction = () =>{
    var that = this
    const options  = {
        //底部弹出框选项
        title:'请选择图片',
        cancelButtonTitle:'取消',
        takePhotoButtonTitle:'拍照',
        chooseFromLibraryButtonTitle:'选择相册',
        quality:0.75,
        allowsEditing:true,
        maxWidth:200,
        noData:false,
        storageOptions: {
            skipBackup: true,
            path:'images'
        }
    }
       ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          var img_url = response.uri;
          let source = { uri: response.uri };
          // You can also display the image using data:
          // let source = { uri: 'data:image/jpeg;base64,' + response.data };
          that.setState({
            nickHeadPic: img_url,
            img_url:img_url
          });
          that._upload();
        }
       });
    }
  _save_info(){
    var that = this;
    var url = Fn.requestUrl+'user/change';
    if (!this.state.img_url) {
    var img_url = this.state.avator;
  }else{
    var img_url = this.state.img_url;
  }
    var nickname = this.state.nickname;
    var sex = this.state.sexcode;
    var datetime = this.state.datetime;
    var email = this.state.email;
    var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    if (!re.test(email)) {
      alert("邮箱格式不正确");
      return;
    };
    let params={
      user_id:this.state.user_id,
      avator:img_url,
      nickname:nickname,
      sex:sex,
      birthday:datetime,
      email:email
    }
    //alert(img_url)
    Fn.postRequest(url,params,function(data){
      if(data==1){
        Fn.showToast('更新资料成功');
        that.props.navigation.state.params.callback()
        that.props.navigation.goBack();
      }

    })
  }
  closeModal(){
    this.setState({
      visible:false,
      visibleemail:false,
    })
  }
  succModal(){
    this.setState({
      visible:false,
      nickname:this.state.newnickname,
    })
  }
  succModal1(){
    this.setState({
      visibleemail:false,
      email:this.state.newemail
    })
  }

  componentDidMount(){
    var info = this.props.navigation.state.params.info;
    var user_id = info.user_id;
    var avator = info.avator;
    this.setState({
      user_id:user_id,
      avator:avator,
      nickHeadPic:Fn.requestUrl+avator,
      nickname:info.nickname,
      sex:options[info.sex],
      datetime:info.birthday,
      email:info.email,
      changetime:info.change_time
    })
  }
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <NavTopBar
        name='我的资料'
        left={true}
        goback={Fn._goback.bind(this)}
        right={true}
        right_icon={require('../images/saveinfo.png')}
        jump={this._save_info.bind(this)}
        />
        <View style={styles.member_info_body}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.cameraAction}
            style={styles.member_info_first}>
            <Text style={styles.member_info_listname}>头像:</Text>
            <Image style={styles.member_info_avator} source={{uri:this.state.nickHeadPic}}/>
            <Image source={require('../images/arrow.png')} style={styles.member_info_arrow} />
          </TouchableOpacity>
          <View style={styles.member_info_title}>
            <Text style={styles.member_info_listname}>账号:</Text>
            <Text style={styles.member_account}>{this.state.user_id}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=>{this.setState({visible:true})}}
            style={styles.member_info_title}>
            <Text style={styles.member_info_listname}>昵称:</Text>
            <Text style={styles.member_info_nickname}>{this.state.nickname}</Text>
            <Image source={require('../images/arrow.png')} style={styles.member_info_arrow} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=> this.ActionSheet.show()}
            style={styles.member_info_title}
          >
            <Text style={styles.member_info_listname}>性别:</Text>
            <Text style={styles.member_info_nickname}>{this.state.sex}</Text>
            <Image source={require('../images/arrow.png')} style={styles.member_info_arrow} />
          </TouchableOpacity>
          <View style={styles.member_info_title}>
            <Text style={styles.member_info_listname}>生日:</Text>
            <DatePicker
              style={styles.member_date}
              date={this.state.datetime}
              mode="date"
              format="YYYY-MM-DD"
              minDate="1950-01-01"
              maxDate="2099-01-01"
              confirmBtnText="确定"
              cancelBtnText="取消"
              showIcon={false}
              onDateChange={(datetime) => {this.setState({datetime: datetime});}}
             />
             <Image source={require('../images/arrow.png')} style={styles.member_info_arrow} />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={()=>{this.setState({visibleemail:true})}}
            style={styles.member_info_title}>
            <Text style={styles.member_info_listname}>邮箱:</Text>
            <Text style={styles.member_info_nickname}>{this.state.email}</Text>
            <Image source={require('../images/arrow.png')} style={styles.member_info_arrow} />
          </TouchableOpacity>
        </View>
        {this.state.changetime!=null?(
          <View style={styles.lasttimeview}>
            <Text style={styles.lasttime}>上次更新时间：{Fn.change(this.state.changetime)}</Text>
          </View>
        ):null}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.visible}
        >
          <View style={styles.member_modal_body}>
            <View style={styles.member_modal}>
              <Text style={styles.modal_type}>昵称：</Text>
              <TextInput
                style={styles.modal_nickname}
                defaultValue={this.state.nickname}
                onChangeText={(newnickname)=>this.setState({
                newnickname:newnickname
              })}
              />
              <View style={styles.modal_btn}>
                <Button title='取消' onPress={this.closeModal.bind(this)}/>
                <Button title='确定' onPress={this.succModal.bind(this)}/>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.visibleemail}
        >
          <View style={styles.member_modal_body}>
            <View style={styles.member_modal}>
              <Text style={styles.modal_type}>邮箱：</Text>
              <TextInput
                style={styles.modal_nickname}
                defaultValue={this.state.email}
                onChangeText={(newemail)=>this.setState({
                newemail:newemail
              })}
              />
              <View style={styles.modal_btn}>
                <Button title='取消' onPress={this.closeModal.bind(this)}/>
                <Button title='确定' onPress={this.succModal1.bind(this)}/>
              </View>
            </View>
          </View>
        </Modal>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={options}
          cancelButtonIndex={0}
          onPress={this.handlePress.bind(this)}
        />
      </View>
    );
  }
}
