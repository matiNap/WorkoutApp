import React, { useState } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { Text } from 'react-native-elements';
import Roll from './Roll';
import metrics from '_metrics';
import palette from '_palette';
import typography from '_typography';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const RANGE = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
];
const HEIGHT = metrics.height * 0.3;
const WIDTH = metrics.width * 0.8;

interface Props {
  title?: string;
  opened: boolean;
  setOpened: (opened: boolean) => void;
  onConfirm: (minutes: number, seconds: number) => void;
}

const TimeSelector = ({
  title,
  setOpened,
  opened,
  onConfirm,
}: Props) => {
  const [minutes, setMinutes] = useState(-1);
  const [seconds, setSeconds] = useState(-1);
  BackHandler.addEventListener('hardwareBackPress', () => {
    if (opened) {
      setOpened(false);
      return true;
    }
  });

  return (
    <View style={[StyleSheet.absoluteFill, styles.background]}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rolls}>
          <Roll range={RANGE} setIndex={setMinutes} label="Minutes" />
          <Roll range={RANGE} setIndex={setSeconds} label="Seconds" />
        </View>
        <View style={styles.buttons}>
          <TouchableWithoutFeedback
            onPress={() => {
              onConfirm(minutes, seconds);
              setOpened(false);
            }}
          >
            <Text style={styles.textButton}>Cancel</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setOpened(false);
            }}
          >
            <Text style={styles.textButton}>OK</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

export default TimeSelector;

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 160,
    top: 0,
    left: 0,
  },
  container: {
    justifyContent: 'center',
    width: WIDTH,
    position: 'absolute',
    top: metrics.height / 2 - HEIGHT / 2,
    left: metrics.width / 2 - WIDTH / 2,
    // height: HEIGHT,
    zIndex: 160,
    alignSelf: 'center',
    backgroundColor: palette.secondary,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rolls: {
    flexDirection: 'row',
    alignSelf: 'center',

    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 15,
    marginTop: 10,
    fontSize: 22,
    marginLeft: 15,
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  textButton: {
    fontWeight: 'bold',
    fontSize: typography.fontSize.big,
    marginTop: 20,
    marginBottom: 15,
  },
});
