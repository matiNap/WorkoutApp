import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import palette from '_palette';
import Timer from './Timer';

interface Props {
  progress: number;
  time: number;
  currentTime: number;
}

const ProgressBar = ({ progress, time, currentTime }: Props) => {
  return (
    <View style={styles.mainContainer}>
      <Timer time={currentTime} />
      <View style={styles.container}>
        <View style={[styles.bar, { width: `${progress ? progress : 0}%` }]} />
      </View>
      <Timer {...{ time }} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  container: {
    width: '60%',
    height: 10,
    overflow: 'hidden',
    borderRadius: 5,
    alignSelf: 'center',
    marginHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bar: {
    backgroundColor: palette.primary,
    height: '100%',
    width: 0,
    borderRadius: 5,
  },
});
