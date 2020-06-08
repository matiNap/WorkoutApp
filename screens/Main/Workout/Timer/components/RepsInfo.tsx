import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import palette from '_palette';

interface Props {
  value: number;
  onNext: () => void;
}

const RepsInfo = ({ value, onNext }: Props) => {
  return (
    <View>
      <Text style={styles.text}>x{value}</Text>
      <TouchableWithoutFeedback onPress={onNext}>
        <View style={styles.button}>
          <Text style={styles.doneText}>Done</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default RepsInfo;

const styles = StyleSheet.create({
  text: {
    fontSize: 50,
    alignSelf: 'center',
    padding: 5,
  },
  doneText: {
    fontSize: 25,
  },
  button: {
    backgroundColor: palette.actions.succes,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
