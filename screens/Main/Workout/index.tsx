import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Timer from './Timer';
import Selector from './Selector';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Selector" component={Selector} />
      <Stack.Screen name="Timer" component={Timer} />
    </Stack.Navigator>
  );
};
