import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Overlay } from 'react-native-elements';
import palette from '_palette';
import typography from '_typography';
import metrics from '_metrics';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Workouts from '_components/WorkoutsList';

const Selector = () => {
  const [opened, setOpened] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          setOpened(!opened);
        }}
      >
        <View style={styles.startButton}>
          <Text style={styles.text}>START</Text>
        </View>
      </TouchableWithoutFeedback>
      {opened && (
        <Overlay
          overlayStyle={styles.overlay}
          onBackdropPress={() => {
            setOpened(!opened);
          }}
        >
          <Workouts />
        </Overlay>
      )}
    </View>
  );
};

export default Selector;
const START_BUTTON_SIZE = metrics.width * 0.6;

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.secondary,
    flex: 1,
    justifyContent: 'center',
  },
  startButton: {
    width: START_BUTTON_SIZE,
    height: START_BUTTON_SIZE,
    borderRadius: START_BUTTON_SIZE,
    backgroundColor: palette.actions.succes,
    shadowColor: palette.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    fontSize: 40,
    alignSelf: 'center',
    color: palette.text.primary,
  },
  overlay: {
    width: metrics.width * 0.85,
    minHeight: metrics.height * 0.55,
  },
});
