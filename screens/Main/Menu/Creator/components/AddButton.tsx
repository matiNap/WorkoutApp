import React, { CSSProperties } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import palette from '_palette';
import metrics from '_metrics';
import { Text } from 'react-native-elements';
import Animated from 'react-native-reanimated';

interface Props {
  onPress: () => void;
  style?: CSSProperties;
}

const AddButton = ({ onPress, style }: Props) => {
  return (
    <TouchableWithoutFeedback {...{ onPress }}>
      <Animated.View style={[styles.container, style]}>
        <View style={styles.content}>
          <MaterialIcons name="add" style={styles.icon} />
          <Text>Add exercise</Text>
        </View>
      </Animated.View>
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
    // position: 'absolute',
    height: metrics.addButtonHeight,
    bottom: 0,
    left: 0,
    width: metrics.width,
    height: 60,
    backgroundColor: palette.secondaryDark,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
