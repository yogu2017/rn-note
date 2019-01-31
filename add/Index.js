/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  AsyncStorage,
  ScrollView
} from 'react-native';
import styles from '../style/Style';
import NavTopBar from '../common/NavTopBar';
import Fn from '../function/Fun';
import ActionSheet from 'react-native-actionsheet';
import  ImagePicker from 'react-native-image-picker'; //第三方相机
var dismissKeyboard = require('dismissKeyboard');
const options = [ '取消', '仅自己可见', '所有人可见','附近的人可见'];
export default class Index extends Component {
  constructor(props) {
  super(props);
  this.state = {
    show_pic:false,
    img_url:'',
    state:'仅自己可见',
    state_index:'1',
    color:'1',
    map_select:'0',
    lon:'',
    lat:'',
    note_img:'',
     };
  }
  handlePress(index) {
    if (index==0) {
      return
    }
    this.setState({
      state_index:index,
      state:options[index],
      map_select:'0',
      lon:'',
      lat:'',
    })
  }
  _upload(){
    var img_url = this.state.img_url;
    var uploadURL = Fn.requestUrl+'notes/upload';
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
         .then((response) => response.json())
         .then((data)=>{
             var note_img = data.files.files.url;
             var img_url = note_img;
             this.setState({img_url:img_url});
             Fn.showToast('上传成功');
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
        maxWidth:600,
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
            note_img:source,
            img_url:img_url,
            show_pic:true
          });
          that._upload();
        }
       });
    }
    _jumpDetail(){
      this.props.navigation.navigate('Detail',{
        note_id:this.state.note_id
      })
    }
    _save(){
      var that = this;
      var note_color = this.state.color;
      var note_content = this.state.note_content;
      var note_img = this.state.img_url;
      var note_state = this.state.state_index;
      var note_areaname = this.state.map_select;
      var note_area_lon = this.state.lon;
      var note_area_lat = this.state.lat;
      var user_id = this.state.user_id;
      let params = {
         note_color : this.state.color,
          note_content:this.state.note_content,
          note_img :this.state.img_url,
          note_state :this.state.state_index,
          note_areaname :this.state.map_select,
         note_area_lon:this.state.lon,
         note_area_lat:this.state.lat,
         user_id:this.state.user_id,
      }
      var url = Fn.requestUrl+'notes/Add';
      Fn.postRequest(url,params,function(data){
        if (data) {
          that.setState({note_id:data})
          Fn.showToast('发布成功');
          that._jumpDetail();
        }else{
          Fn.showToast('发布失败，请重试');
        }
      })
    }
    _delete(){
      this.setState({
        show_pic:false,
        note_img:'',
        img_url:''
      })
    }
    componentWillMount(){
      AsyncStorage.getItem('phonenum',(error,phonenum)=>{this.setState({user_id:phonenum})});
    }
  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={styles.container} scrollEnabled={false}>
        <NavTopBar
        name='发布便签'
        right={true}
        right_icon={require('../images/release.png')}
        jump={this._save.bind(this)}
        />
        <View style={styles.add_txt}>
          <TextInput
            style={styles.add_input}
            multiline={true}
            returnKeyType="done"
            onChangeText={(content)=>this.setState({
              note_content:content
            })}
            onSubmitEditing={()=>dismissKeyboard()}
            blurOnSubmit={true}
            placeholder='此时此刻你想写点什么..'
          />
          <View style={styles.pic_row}>
            {this.state.show_pic?(<View style={styles.add_new_pic}>
                <TouchableOpacity
                activeOpacity={0.9}
                style={styles.pic_del_show}
                onPress={this._delete.bind(this)}
                >
                <Image style={styles.pic_del}  source={require('../images/delete.png')}/>
                </TouchableOpacity>
                <Image style={styles.show_pic} source={this.state.note_img} />
            </View>):null}
            <TouchableOpacity
             activeOpacity={0.9}
             onPress={this.cameraAction}
             style={styles.add_pic_view}
             >
                <Image style={styles.add_pic} source={require('../images/camera.png')}/>
                <Text style={styles.add_pic_txt}>添加图片</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sel_color}>
          <Text style={styles.note_color_txt}>便签颜色</Text>
          <View style={styles.color_row}>
            <TouchableOpacity
            onPress={Fn._red.bind(this)}
            style={[styles.note_color,styles.red,(this.state.color==1?styles.select_red:null)]}
            ></TouchableOpacity>
            <TouchableOpacity onPress={Fn._blue.bind(this)}
              style={[styles.note_color,styles.blue,(this.state.color==2?styles.select_blue:null)]}
              ></TouchableOpacity>
            <TouchableOpacity onPress={Fn._yellow.bind(this)}
              style={[styles.note_color,styles.yellow,(this.state.color==3?styles.select_yellow:null)]}
              ></TouchableOpacity>
            <TouchableOpacity onPress={Fn._green.bind(this)}
              style={[styles.note_color,styles.green,(this.state.color==4?styles.select_green:null)]}
              ></TouchableOpacity>
            <TouchableOpacity onPress={Fn._pink.bind(this)}
              style={[styles.note_color,styles.pink,(this.state.color==5?styles.select_pink:null)]}
              ></TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
        activeOpacity={0.9}
        onPress={()=> this.ActionSheet.show()}
         style={styles.sel_color}>
          <Text style={styles.note_color_txt}>谁可以看</Text>
          <View style={styles.note_see}>
          <Text >{this.state.state}</Text>
          <Image style={styles.note_arrow} source={require('../images/arrow.png')}/>
          </View>
        </TouchableOpacity>
        {this.state.state_index==3?
          <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigate('Map',{
            callback:(mapname,lon,lat)=>{
              this.setState({
                map_select:mapname,
                lon:lon,
                lat:lat,
              })
            }
          })}
           style={styles.sel_color}
           >
          <View style={styles.note_see}>
            <Text style={styles.note_color_txt}>可见范围</Text>
            <Text style={styles.note_see_txt}>(500米内)</Text>
          </View>
          <View style={styles.note_see}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.note_map}>{this.state.map_select==0?'不显示':this.state.map_select}</Text>
          <Image style={styles.note_arrow} source={require('../images/arrow.png')}/>
          </View>
        </TouchableOpacity>:null}
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'请选择谁可以看'}
          options={options}
          cancelButtonIndex={0}
          onPress={this.handlePress.bind(this)}
        />
      </ScrollView>
    );
  }
}
