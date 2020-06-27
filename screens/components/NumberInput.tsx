import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import palette from '_palette';
import { Text } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import stylesheet from '_stylesheet';
import metrics from '_metrics';
import globals from '_globals';

interface Props {
  value: number;
  setValue: (num: number) => void;
  updateValue: (offset: 1 | -1) => void;
  maxRange: number;
}

export default function NumberInput({ value, setValue, updateValue, maxRange }: Props) {
  const [timer, setTimer] = useState(null);
  return (
    <View style={styles.container}>
      <View style={globals.isIphone ? SHADOW : {}}>
        <TouchableWithoutFeedback
          style={[styles.buttonContainer, globals.isIphone ? {} : SHADOW]}
          onLongPress={() => {
            setTimer(
              setInterval(() => {
                updateValue(1);
              }, 50),
            );
          }}
          onPressOut={() => {
            clearInterval(timer);
          }}
          onPress={() => {
            if (value < maxRange) {
              setValue(value + 1);
            }
          }}
        >
          <AntDesign name="plus" style={stylesheet.icon} />
        </TouchableWithoutFeedback>
      </View>
      <Text style={styles.value}>{value < 10 ? `0${value}` : value}</Text>
      <View style={globals.isIphone ? SHADOW : {}}>
        <TouchableWithoutFeedback
          style={[styles.buttonContainer, globals.isIphone ? {} : SHADOW]}
          onLongPress={() => {
            setTimer(
              setInterval(() => {
                updateValue(-1);
              }, 50),
            );
          }}
          onPressOut={() => {
            clearInterval(timer);
          }}
          onPress={() => {
            if (value > 0) {
              setValue(value - 1);
            }
          }}
        >
          <AntDesign name="minus" style={stylesheet.icon} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 5,

  elevation: 10,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
  },
  value: {
    fontSize: 30,
    marginVertical: 10,
    height: metrics.height * 0.05,
    width: metrics.width * 0.12,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: palette.secondaryDark,
    borderRadius: 10,
    padding: 2,
  },
});
