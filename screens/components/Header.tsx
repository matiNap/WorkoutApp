import React, { CSSProperties, ReactNode } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import palette from '_palette';
import metrics from '_metrics';
import Animated from 'react-native-reanimated';

interface Props {
  style?: CSSProperties;
  children: ReactNode;
}

const Header = ({ children, style }: Props) => {
  return <Animated.View style={[styles.header, style]}>{children}</Animated.View>;
};

export default Header;

const styles = StyleSheet.create({
  header: {
    top: 0,
    left: 0,
    width: metrics.width,
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
    height: metrics.headerHeight,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
