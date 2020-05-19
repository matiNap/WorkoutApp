import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Excercises from './Excercises';
import Creator from './Creator';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Excercises" component={Excercises} />
      <Stack.Screen name="Creator" component={Creator} />
    </Stack.Navigator>
  );
};
