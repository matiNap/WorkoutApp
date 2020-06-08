import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import stylesheet from '_stylesheet';
import { workout } from '_types';
import typography from '_typography';
import { AntDesign } from '@expo/vector-icons';

interface Props {
  workout: workout;
  onRequestClose: () => void;
}

const Header = ({ workout: { name }, onRequestClose }: Props) => {
  return (
    <View style={[stylesheet.row, styles.container]}>
      <Text style={styles.name}>{name}</Text>
      <AntDesign name="close" style={stylesheet.icon} onPress={onRequestClose} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  name: {
    fontSize: typography.fontSize.header,
  },
});
