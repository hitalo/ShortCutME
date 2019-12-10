import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainList  from '../components/MainList';
import Help  from '../components/Help';

const MainNavigator = createStackNavigator({
 
  MainList: { screen: MainList },
  Help : { screen: Help },
}, {
  initialRouteName: 'MainList',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#00f',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
  
const MainContainer = createAppContainer(MainNavigator);
export default MainContainer;