import React, { CSSProperties } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import palette from '_palette';
import { timerToString } from '_helpers';

interface Props {
  size?: number;
  time: number;
  style?: CSSProperties;
}

const Timer = ({ size, time, style }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, { fontSize: size }]}>{timerToString(time)}</Text>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  text: {
    fontSize: 19,
    color: palette.text.primary,
  },
  container: {
    alignSelf: 'center',
  },
});
