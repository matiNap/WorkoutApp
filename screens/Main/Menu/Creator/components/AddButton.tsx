import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import palette from '_palette';

const AddButton = () => {
  return (
    <TouchableWithoutFeedback>
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
