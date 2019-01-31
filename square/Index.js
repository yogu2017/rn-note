/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import styles from '../style/Style';
import Fn from '../function/Fun';
import NavTopBar from '../common/NavTopBar';
export default class Index extends Component {
  constructor(props) {
  super(props);
  this.state = {
    data:[],
    refreshing: false,
    page:1,
    isLoadMore:false
     };
  }
  componentDidMount(){
    this.getData()
  }
  getData(){
    var that = this;
    var url = Fn.requestUrl+'notes/Square';
    var page = this.state.page
    params={page:page}
    Fn.getRequest(url,params,function(data){
      if (page==1) {
        that.setState({
          data:data
        })
      } else {
        that.setState({
          isLoadMore : false,
          data:that.state.data.concat(data)
        })
      }
    })
  }
  _renderRefresh = () => {
       this.setState({refreshing: true})//开始刷新
       //这里模拟请求网络，拿到数据，3s后停止刷新
       this.getData();
       setTimeout(() => {
           this.setState({refreshing: false});
           Fn.showToast('刷新完成')
       }, 1000);
   };
   _onEndReached(){
     var that =this;
     if (!that.state.isLoadMore && that.state.data.length >0) {
       that.setState({page:that.state.page+1})
       that.getData()
     }
   }
  _keyExtractor = (item, index) => item.note_id;
  _renderItem = ({item}) => (
          <TouchableOpacity
          activeOpacity={0.8}
          style={styles.square_view}
          onPress={() => this.props.navigation.navigate('Detail',{note_id:item.note_id})}
          >
            {item.note_img?(<Image style={styles.square_note_pic} source={{uri:Fn.requestUrl+item.note_img}} />):null}
            <Text numberOfLines={1} style={styles.square_note_title}>{item.note_content}</Text>
            <View style={styles.square_note_view}>
              <Image style={styles.square_view_avator} source={{uri:'https://img3.duitang.com/uploads/item/201512/25/20151225132409_NKFCh.jpeg'}} />
              <View style={styles.square_author}>
                <Text style={styles.square_author_name}>奔跑的蚂蚱</Text>
                <View style={{flexDirection: 'row',marginTop: 5}}>
                <Text style={styles.square_author_time}>{Fn.change(item.time)}</Text>
                {item.note_areaname!='0'?(
                  <Image style={{height: 12,width: 12,marginLeft: 15,marginRight: 1}} source={require('../images/area.png')}/>
                ):null}
                {item.note_areaname!='0'?(
                  <Text numberOfLines={1}  style={styles.square_author_time}>{item.note_areaname}</Text>
                ):null}
                </View>
              </View>
            </View>
          </TouchableOpacity>
  );
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <NavTopBar
        name='广场'
        right={true}
        right_icon={require('../images/msg.png')}
        jump={Fn._msgList.bind(this)}
        />
        <FlatList
          ref={(flatList)=>this._flatList = flatList}
          refreshing ={this.state.refreshing}
          data={this.state.data}
          onRefresh={this._renderRefresh}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={0.1}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
         />
      </View>
    );
  }
}
