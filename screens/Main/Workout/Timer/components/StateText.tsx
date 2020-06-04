import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { workoutType } from '_types';
import palette from '_palette';

interface Props {
  name: string;
  type: 'workout' | 'break';
  isNextLoop: boolean;
  workoutType: workoutType;
}

const StateText = ({ name, type, isNextLoop, workoutType }: Props) => {
  if (type === 'workout') {
    return <Text style={styles.text}>{name}</Text>;
  } else if (isNextLoop) {
    return (
      <Text style={[styles.text, styles.brk]}>{`Next ${
        workoutType === 'series' ? 'series' : 'interval'
      }`}</Text>
    );
  }
  return <Text style={[styles.text, styles.brk]}>Break</Text>;
};

export default StateText;

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    fontSize: 25,
    marginTop: 15,
  },
  brk: {
    fontWeight: 'bold',
    color: palette.text.primary,
    fontSize: 25,
  },
});
