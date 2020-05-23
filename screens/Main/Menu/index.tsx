import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Workouts from './Workouts';
import Creator from './Creator';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Workouts" component={Workouts} />
      <Stack.Screen name="Creator" component={Creator} />
    </Stack.Navigator>
  );
};
