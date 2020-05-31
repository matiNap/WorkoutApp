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
    <TouchableWithoutFeedback {...{ onPress }}>
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
});
