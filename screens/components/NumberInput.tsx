import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import typography from '_typography';
import palette from '_palette';
import { onChange } from 'react-native-reanimated';
import { Text } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import stylesheet from '_stylesheet';

interface Props {
  value: number;
  setValue: (num: number) => void;
}

export default function NumberInput({ value, setValue }: Props) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        style={[styles.buttonContainer]}
        onPress={() => {
          if (value < 100) {
            setValue(value + 1);
          }
        }}
      >
        <AntDesign name="plus" style={stylesheet.icon} />
      </TouchableWithoutFeedback>
      <Text style={styles.value}>{value < 10 ? `0${value}` : value}</Text>
      <TouchableWithoutFeedback
        style={[styles.buttonContainer]}
        onPress={() => {
          if (value > 0) {
            setValue(value - 1);
          }
        }}
      >
        <AntDesign name="minus" style={stylesheet.icon} />
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
  },
  value: {
    fontSize: 30,
    marginVertical: 10,
  },
  buttonContainer: {
    backgroundColor: palette.secondaryDark,
    borderRadius: 10,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,

    elevation: 10,
  },
});
