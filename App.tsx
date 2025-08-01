/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { CreateDealScreen } from './src/screens/CreateDealScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  // Для демонстрации используем фиксированный userId
  const userId = 123456789;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'SafeDeal' }}
          initialParams={{ userId }}
        />
        <Stack.Screen
          name="CreateDeal"
          component={CreateDealScreen}
          options={{ title: 'Создать сделку' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
