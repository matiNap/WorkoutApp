import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import palette from '_palette';
import Workouts from '_components/Workouts';
import { MaterialIcons } from '@expo/vector-icons';
import metrics from '_metrics';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const Excercises = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Workouts />
      <View style={styles.addContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('Creator');
          }}
        >
          <MaterialIcons name="add" style={styles.addIcon} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const ADD_SIZE = metrics.width * 0.17;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.secondary,
    paddingTop: StatusBar.currentHeight + 15,
    paddingHorizontal: 10,
  },
  addContainer: {
    backgroundColor: palette.primary,
    width: ADD_SIZE,
    height: ADD_SIZE,
    justifyContent: 'center',
    borderRadius: ADD_SIZE,
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addIcon: {
    fontSize: 35,
    color: palette.text.primary,
    alignSelf: 'center',
  },
});

export default Excercises;
