import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';

import Workout from './Main/Workout';
import Menu from './Main/Menu';
import palette from '_palette';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { loadWorkouts } from '_actions/creators/workout';
import { createStackNavigator } from '@react-navigation/stack';
import Creator from './Main/Creator';
import Start from './Main/Start';
import metrics from '_metrics';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

StatusBar.setBarStyle('light-content');

interface Props {
  loadWorkouts: typeof loadWorkouts;
}

const TabNav = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        activeTintColor: palette.primary,
        inactiveTintColor: palette.grayscale.light,

        style: {
          backgroundColor: palette.secondaryDark,
          height: metrics.windowHeight * 0.08,
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="Start"
        component={Start}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="running" color={color} size={30} />,
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon: ({ color }) => <SimpleLineIcons name="menu" color={color} size={30} />,
        }}
      />
    </Tab.Navigator>
  );
};

class AppContainer extends React.Component<Props> {
  componentDidMount() {
    this.props.loadWorkouts();
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen component={TabNav} name="Main" />

          <Stack.Screen component={Creator} name="Creator" />
          <Stack.Screen component={Workout} name="Workout" />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default connect(null, { loadWorkouts })(AppContainer);
