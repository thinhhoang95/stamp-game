import * as React from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './Home'
import Transactions from './Transactions'
import ScanStamp from './ScanStamp'
import SubTasks from './SubTasks'
import Salary from './Salary'
import HabitsScreen from './HabitsScreen'
import Regular from './Regular'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import allReducers from './AllReducers'

import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';

const Stack = createStackNavigator();

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: [
    'all',
  ],
  // Blacklist (Don't Save Specific Reducers)
  blacklist: [
    
  ],
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, allReducers);
// Redux: Store
const store = createStore(
  persistedReducer
  /*applyMiddleware(
    createLogger(),
  ),*/
);
// Middleware: Redux Persist Persister
let persistor = persistStore(store);

const AppX = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Transactions" component={Transactions} />
            <Stack.Screen name="Scanstamp" component={ScanStamp} />
            <Stack.Screen name="SubTasks" component={SubTasks} />
            <Stack.Screen name="Salary" component={Salary} />
            <Stack.Screen name="Habits" component={HabitsScreen} />
            <Stack.Screen name="Regular" component={Regular} />
          </Stack.Navigator>
        </NavigationContainer>
    </PersistGate>
    </Provider>
  );
}

export default AppX;