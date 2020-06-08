import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import palette from '_palette';

interface Props {
  onPress: () => void;
}

const AddButton = ({ onPress }: Props) => {
  return (
    <TouchableWithoutFeedback {...{ onPress }} style={styles.container}>
      <MaterialIcons name="add" style={styles.icon} />
    </TouchableWithoutFeedback>
  );
};

export default AddButton;

const styles = StyleSheet.create({
  icon: {
    fontSize: 45,
    paddingVertical: 10,
    color: palette.text.primary,
    alignSelf: 'center',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
