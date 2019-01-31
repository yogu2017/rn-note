/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  Alert
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
      note_id:this.props.navigation.state.params.note_id,
      data:[],
      note_user:'',
      show:false,
      icon:false
     };
  }
  _edit(){
    this.props.navigation.navigate('Edit',{
      data:this.state.data,
      callback:()=>{this._get_detail()}
    })
  }
  _delete(){
    var that = this;
    var url = Fn.requestUrl+'notes/Delete';
    var params={
      note_id:this.state.note_id
    }
    Alert.alert(
    '确定删除吗？',
    '',
    [
      {text: '确定', onPress: () =>
      Fn.postRequest(url,params,function(data){
        if (data==1) {
          Fn.showToast('已删除');
          that.props.navigation.goBack();
          that.props.navigation.state.params.callback()
        }
      })
    },
      {text: '取消', onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )
    // Fn.postRequest(url,params,function(data){
    //   if (data==1) {
    //     Fn.showToast('已删除');
    //     that.props.navigation.goBack();
    //     that.props.navigation.state.params.callback()
    //   }
    // })
  }
  _get_detail(){
    AsyncStorage.getItem('phonenum',(error,phonenum)=>{
      this.setState({user_id:phonenum});
      var that =this;
      var note_id = this.state.note_id;
      var url = Fn.requestUrl+'notes/Detail';
      var params={
        gid:note_id,
        user_id:phonenum,
      }
      //alert(user_id)
      Fn.getRequest(url,params,function(data){
        that.setState({
          data:data.data,
          note_user:data.data[0].user_id
        })
        if (data.res==1) {
          that.setState({show:false})
          return
        }
        if (that.state.user_id!=data.data[0].user_id) {
          that.setState({show:true})
        }else{
          that.setState({icon:true})
        }
        })
    })
  }
  componentDidMount(){
    this._get_detail()
  }
    _keyExtractor = (item, index) => item.note_id;
    _renderItem = ({item}) => (
      <View style={styles.note_d_body}>
        <Text style={styles.note_d_txt}>{item.note_content}</Text>
        <Image style={styles.note_d_pic} source={{uri:Fn.requestUrl+item.note_img}}/>
      </View>
    );
  render() {
    const {navigate,state} = this.props.navigation;
    return (
      <View style={[styles.container,styles.detail_body]}>
        <NavTopBar
        name='便签'
        goback={Fn._goback.bind(this)}
        left={true}
        />
        <View style={styles.note_d_view}>
          <Text style={styles.note_d_name}>{this.state.user_id!=this.state.note_user?(this.state.note_user+'的便签'):('我的便签')}</Text>
          <View style={styles.note_d_icon_view}>
          {this.state.icon?(
            <TouchableOpacity
            activeOpacity={0.8}
            onPress={this._edit.bind(this)}
            >
              <Image style={styles.note_d_icon} source={require('../images/edit.png')} />
            </TouchableOpacity>
          ):null}
          {this.state.icon?(
            <TouchableOpacity
            activeOpacity={0.8}
            onPress={this._delete.bind(this)}
            >
              <Image style={styles.note_d_icon} source={require('../images/deletenote.png')} />
            </TouchableOpacity>
          ):null}

          </View>
        </View>
        <FlatList
          refreshing ={true}
          data={this.state.data}
          ListHeaderComponent={this._header}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
         />
         {this.state.show?(
           <TouchableOpacity
             activeOpacity={0.8}
             style={styles.serect_show}
             onPress={() => navigate('Secret',{
               note_id:this.state.note_id,
               user_id:this.state.user_id,
               note_user:this.state.note_user,
               callback:(show)=>{
                 this.setState({
                   show:show
                 })
               }
             })}
           >
             <Text style={styles.serect_txt}>我想对你说</Text>
           </TouchableOpacity>
         ):null}
      </View>
    );
  }
}
