import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import typography from '_typography';

interface Props {
  setOpened: (opened: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ExitButtons = ({ onCancel, onConfirm, setOpened }: Props) => {
  return (
    <View style={styles.buttons}>
      <TouchableWithoutFeedback
        onPress={() => {
          setOpened(false);
          if (onCancel) onCancel();
        }}
      >
        <Text style={styles.textButton}>Cancel</Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          setOpened(false);
          onConfirm();
        }}
      >
        <Text style={styles.textButton}>OK</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ExitButtons;

const styles = StyleSheet.create({
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
