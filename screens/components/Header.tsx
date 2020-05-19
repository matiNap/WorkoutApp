import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import palette from '_palette';

const Header = ({ children }) => {
  return <View style={styles.header}>{children}</View>;
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: palette.secondaryDark,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,

    // elevation: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 80,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
