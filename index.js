import { AppRegistry } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import App from './App';
import Home from './home/Index';
import Detail from './home/Detail';
import Edit from './home/Edit';
import Add from './add/Index';
import Square from './square/Index';
import Secret from './secret/Index';
import Member from './member/Index';
import List from './square/List';
import Map from './add/MapList';
import Login from './member/Login';
import Register from './member/Register';
import ForgetPwd from './member/ForgetPwd';
import ModUserInfo from './member/ModUserInfo';
import MyMsg from './member/MyMsg';
import Recycle from './member/Recycle';
import MyNote from './member/MyNote';
import Set from './member/Set';
const MyApp = createStackNavigator({
  App: { screen: App },
  Detail:{ screen: Detail},
  Edit:{ screen: Edit},
  Secret:{ screen: Secret},
  Member:{ screen: Member},
  List:{ screen: List},
  Map:{ screen: Map},
  Login:{ screen: Login},
  Register:{ screen: Register},
  ForgetPwd:{ screen: ForgetPwd},
  ModUserInfo:{ screen: ModUserInfo},
  MyMsg:{ screen: MyMsg},
  Recycle:{ screen: Recycle},
  MyNote:{ screen: MyNote},
  Set:{ screen: Set},
},{
  initialRouteName: 'App',
});
AppRegistry.registerComponent('qnote', () => MyApp);
