import * as React from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './Home'
import Transactions from './Transactions'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import allReducers from './AllReducers'

const Stack = createStackNavigator();
const store = createStore(allReducers);

const AppX = () => {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Transactions" component={Transactions} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

export default AppX;