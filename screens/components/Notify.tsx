import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import palette from '_palette';
import metrics from '_metrics';
import typography from '_typography';
import Overlay from '_components/Overlay';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface Props {
  content: string;
  opened: boolean;
  close: () => void;
}

export default ({ content, opened, close }: Props) => {
  return (
    <Overlay
      {...{ opened }}
      close={close}
      height={metrics.height * 0.15}
      width={metrics.width * 0.8}
    >
      <View style={styles.container}>
        <Text style={styles.content}>{content}</Text>
        <TouchableWithoutFeedback onPress={close} style={{ alignSelf: 'center' }}>
          <Text style={styles.accept}>OK</Text>
        </TouchableWithoutFeedback>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  content: {
    alignSelf: 'center',
  },
  accept: {
    fontSize: typography.fontSize.big,
    marginTop: 20,
    alignSelf: 'center',
  },
});
