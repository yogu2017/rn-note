/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  FlatList
} from 'react-native';
import styles from '../style/Style';
import  {DeviceEventEmitter} from 'react-native';
import Fn from '../function/Fun';
import NavTopBar from '../common/NavTopBar';
export default class Index extends Component {
  constructor(props) {
  super(props);
  this.state = {
    weather:[],
    isLogin:false,
    right:false,
    sum:0,
    open_count:0,
    secret_count:0,
    refreshing: false
     };
  }
  componentWillMount(){
    AsyncStorage.getItem('phonenum',(error,phonenum)=>{
        if (phonenum) {
          this.setState({isLogin:true,right:true,user_id:phonenum})
        }else{
          return
        }
    });
  }
  componentDidMount(){
    this.getData()
  }
  getData(){
    AsyncStorage.getItem('phonenum',(error,phonenum)=>{
      var user_id =phonenum;
      if(!user_id){
        return
      }
      var that = this;
      var url = Fn.requestUrl+'notes/Index';
      params={user_id:user_id}
      Fn.postRequest(url,params,function(data){
        that.setState({
          data:data.res,
          sum:data.count,
          open_count:data.open_count,
          secret_count:data.secret_count,
          user_id:phonenum
        })
      })
    });
  }
  _top(id){
    var that= this;
    var url = Fn.requestUrl+'notes/Top';
    var url1 = Fn.requestUrl+'notes/Untop';
    var params={note_id:id};
    Fn.getRequest(url,params,function(data){
      if(data==1){
        that.getData()
        Fn.showToast('已置顶')
      }else if(data==0){
        Fn.getRequest(url1,params,function(data){
          if (data==1) {
            that.getData()
            Fn.showToast('已取消置顶')
          }else {
            Fn.showToast('操作失败')
          }
        })
      }else{
        Fn.showToast('网络超时，请稍后重试')
      }
    })
  }
  _renderRefresh = () => {
       this.setState({refreshing: true})//开始刷新
       this.getData();
       setTimeout(() => {
           this.setState({refreshing: false});
           Fn.showToast('刷新完成')
       }, 1000);
   };
   _keyExtractor = (item, index) => item.note_id;
   _renderItem = ({item}) => (
     <TouchableOpacity
       activeOpacity={0.8}
       style={[styles.home_title,styles.home_note_style]}
       onPress={() =>this.props.navigation.navigate('Detail',{
         note_id:item.note_id,
         callback:()=>{
           this.getData();
         }
       })}
     >
       <View style={item.note_color==1?(styles.home_color_red):(item.note_color==2?(styles.home_color_blue):(item.note_color==3?(styles.home_color_yellow):(item.note_color==4?(styles.home_color_green):(styles.home_color_pink))))}></View>
       <View style={styles.home_note}>
         <Text style={styles.home_note_title} numberOfLines={1}>{item.note_content}</Text>
         <Text style={styles.home_note_time}>{Fn.change(item.time)}</Text>
       </View>
       <TouchableOpacity
         onPress={()=>{
           this._top(item.note_id)
         }}
         activeOpacity={0.8}
         style={styles.home_star}
       >
         {item.note_top==0?(
           <Image style={styles.home_note_star} source={require('../images/star_default.png')}/>
         ):(
           <Image style={styles.home_note_star} source={require('../images/star.png')}/>
         )}
       </TouchableOpacity>
     </TouchableOpacity>
   )
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
      <StatusBar barStyle={'light-content'} hidden={false}/>
      <NavTopBar
      left={false}
      right={this.state.right}
      jump={Fn._member.bind(this)}
      right_icon={require('../images/my.png')}
      name='首页'
      />
      {!this.state.isLogin?
        (
          <TouchableOpacity
          onPress={()=>navigate('Login',{
                callback:()=>{
                    this.setState({
                      isLogin:true,
                      right:true
                    })
                    this.getData()
                  }}
        )}
          style={styles.centering}>
            <Text>您当前还未登录</Text>
            <Text style={{marginTop:15}}>请登录</Text>
          </TouchableOpacity>
        ):
        (<View style={styles.container}>
        <View>
          <Image style={styles.head_img} source={{uri:'https://img.zcool.cn/community/010fae57e4ff790000012e7ea0bae2.jpg'}}/>
          <View style={styles.home_top_view}>
            <Text style={styles.home_top_txt}>便签数</Text>
            <View style={styles.home_top_num}>
              <Text style={[styles.home_top_txt,styles.home_top_txt_size]}>{this.state.sum}</Text>
              <Text style={[styles.home_top_txt,style={marginLeft: 15,marginTop: 22}]}>个</Text>
            </View>
            <Text style={styles.home_top_txt}>公开{this.state.open_count}个，悄悄话{this.state.secret_count}个</Text>
          </View>
        </View>
          <FlatList
            ref={(flatList)=>this._flatList = flatList}
            refreshing ={this.state.refreshing}
            data={this.state.data}
            onRefresh={this._renderRefresh}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
           />
        </View>)}

      </View>
    );
  }
}
