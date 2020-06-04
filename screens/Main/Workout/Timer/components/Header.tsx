import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import stylesheet from '_stylesheet';
import { useSelector } from 'react-redux';
import { workout } from '_types';
import typography from '_typography';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Props {
  workout: workout;
}

const Header = ({ workout: { name } }: Props) => {
  const { goBack } = useNavigation();
  return (
    <View style={[stylesheet.row, styles.container]}>
      <Text style={styles.name}>{name}</Text>
      <AntDesign name="close" style={stylesheet.icon} onPress={goBack} />
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
