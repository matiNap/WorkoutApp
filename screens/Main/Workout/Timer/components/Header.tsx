import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import stylesheet from '_stylesheet';
import { workout } from '_types';
import typography from '_typography';
import { AntDesign } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import metrics from '_metrics';

interface Props {
  workout: workout;
  onRequestClose: () => void;
}

const Header = ({ workout: { name }, onRequestClose }: Props) => {
  return (
    <View style={[stylesheet.row, styles.container]}>
      <Text style={styles.name}>{name}</Text>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <AntDesign name="close" style={stylesheet.icon} />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    position: 'absolute',
    top: metrics.statusBarHeight + 10,
    left: 0,
    width: metrics.width,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: typography.fontSize.header,
  },
});
