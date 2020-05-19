import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';

import Workout from './Main/Workout';
import Menu from './Main/Menu';
import palette from '_palette';
import { StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();

StatusBar.setBarStyle('light-content');

export default () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          showLabel: false,
          activeTintColor: palette.primary,
          inactiveTintColor: palette.grayscale.light,
          style: {
            backgroundColor: palette.secondary,
            borderTopColor: 'black',
          },
        }}
      >
        <Tab.Screen
          name="Workout"
          component={Workout}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="running" color={color} size={30} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={Menu}
          options={{
            tabBarIcon: ({ color }) => (
              <SimpleLineIcons name="menu" color={color} size={30} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
