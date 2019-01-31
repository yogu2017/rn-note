/* @c'est-la-vie*/

import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import NavTopBar from '../common/NavTopBar';
import Fn from '../function/Fun';
import styles from '../style/Style';
var Geolocation = require('Geolocation');
export default class MapList extends Component {
  static  navigationOptions = {
   header:null,
   gesturesEnabled:true,
   //gestureResponseDistance:{horizontal:300},
 };
  constructor(props) {
  super(props);
  this.state = {
    data:[],
    name:'',
    animating:true,
     };
  }
  componentDidMount(){
    this.getLocation();
  }
  _keyExtractor = (item, index) => item.name;
  _separator = () => {
    return <View style={{height:1,backgroundColor:'#bbb'}}/>;
  }
  _header = () => {
    return <View style={styles.map_default}>
          <Text style={styles.map_default_name}>不显示位置</Text></View>;
  }
  _renderItem = ({item}) => (
    <TouchableOpacity
    activeOpacity={0.7}
    onPress={()=>{
      this._map_select(item);
    }}
    style={styles.map_list}>
      <View style={styles.map_detail}>
        <Text style={styles.map_name}>{item.name}</Text>
        {//this.state.select?<Image style={styles.selected_img} source={require('../images/selected.png')} />:null
      }
      </View>
      <View style={styles.map_detail}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.map_info,styles.map_name]}>{item.addr}</Text>
        <Text style={styles.map_info}>{item.distance}米</Text>
      </View>
    </TouchableOpacity>
  );
  getLocation() {
   Geolocation.getCurrentPosition(
       location => {
           var result = "速度：" + location.coords.speed +
                       "\n经度：" + location.coords.longitude +
                       "\n纬度：" + location.coords.latitude +
                       "\n准确度：" + location.coords.accuracy +
                       "\n行进方向：" + location.coords.heading +
                       "\n海拔：" + location.coords.altitude +
                       "\n海拔准确度：" + location.coords.altitudeAccuracy +
                       "\n时间戳：" + location.timestamp;
           let lon = location.coords.longitude;
           let lat = location.coords.latitude;
           let ak = 'nsKTq74MmusFsHs3GfpTq5FH';
           let baiduUrl = 'http://api.map.baidu.com/geocoder/v2/?coordtype=wgs84ll&';
           let url = baiduUrl+'location='+lat+','+lon+'&output=json&pois=1&ak='+ak;
           //alert(url);
           fetch(url,{
             method:'GET',
             headers:{
               'Accept': 'application/json',
               'Content-Type': 'application/json'
             },
           })
           .then((response)=>response.json())
           .then((json)=>{
             this.setState({
               data:json.result.pois,
               animating:false,
             })
             //alert(json.result.formatted_address)
           })
             .catch((error)=>{
               console.error('error',error)
               //alert(error)
             });
       },
       error => {
         alert("获取位置失败："+ error)
       }
   );
}
_map_select(item){
  var mapmame = item.name;
  var lon =item.point.x;
  var lat =item.point.y;
  this.props.navigation.state.params.callback(mapmame,lon,lat);
  this.props.navigation.goBack();
}
  render() {
    const {navigate} = this.props.navigation;
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <NavTopBar
        name='地点'
        goback={Fn._goback.bind(this)}
        left={true}
        />
        <ActivityIndicator
        animating={this.state.animating}
        style={styles.centering}
        size="large"
      />
        <FlatList
          refreshing ={true}
          data={this.state.data}
          keyExtractor={this._keyExtractor}
          ListHeaderComponent={this._header}
          ItemSeparatorComponent={this._separator}
          renderItem={this._renderItem}
         />
      </View>
    );
  }
}
