import React, { useState } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import typography from '_typography';
import WorkoutsList from '_components/WorkoutsList';
import palette from '_palette';
import StartScreen from '../Timer/components/StartScreen';
import Header from '_components/Header';
import Back from '_components/Back';
import { Text } from 'react-native-elements';

export default function Selector() {
  const { navigate } = useNavigation();
  const [starterEnded, setStarterEnded] = useState(false);
  const [selected, setSelected] = useState(null);
  BackHandler.addEventListener('hardwareBackPress', () => {
    navigate('Start');
    return true;
  });
  if (!starterEnded) {
    return (
      <View style={styles.container}>
        <Header style={{ backgroundColor: 'transparent', justifyContent: 'flex-start' }}>
          <Back
            onPress={() => {
              navigate('Start');
            }}
          />
          <Text style={styles.title}>Select workout:</Text>
        </Header>
        <WorkoutsList
          onPress={(workoutId) => {
            setSelected(workoutId);
            setStarterEnded(true);
          }}
        />
      </View>
    );
  } else
    return (
      <StartScreen
        endStart={() => {
          navigate('Timer', { workoutId: selected });
        }}
      />
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: palette.secondary,
  },
  header: { justifyContent: 'flex-start' },
  title: {
    fontSize: typography.fontSize.header,
    marginLeft: 10,
  },
});
