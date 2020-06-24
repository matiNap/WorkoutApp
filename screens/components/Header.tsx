import React, { CSSProperties, ReactNode } from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import palette from '_palette';
import metrics from '_metrics';
import Animated from 'react-native-reanimated';

interface Props {
  style?: CSSProperties;
  children: ReactNode;
}

const Header = ({ children, style }: Props) => {
  return (
    <Animated.View style={[styles.header, style]}>
      <View style={styles.container}>{children}</View>
    </Animated.View>
  );
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
    alignSelf: 'center',
    alignContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: metrics.headerHeight,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flex: 1,
    marginTop: metrics.statusBarHeight,
    height: metrics.headerHeight - 20,
  },
});
