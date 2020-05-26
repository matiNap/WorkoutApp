import React, { ReactNode, CSSProperties } from 'react';
import { StyleSheet, View } from 'react-native';
import metrics from '_metrics';
import { useTransition } from 'react-native-redash';
import Animated, { Easing } from 'react-native-reanimated';
import palette from '_palette';

interface Props {
  width?: number;
  height?: number;
  opened: boolean;
  children: ReactNode;
  style?: CSSProperties;
  absoluteComponent: () => ReactNode;
}

const Overlay = ({
  style,
  opened,
  children,
  absoluteComponent,
}: Props) => {
  const transitionValue = useTransition(opened, {
    duration: 150,
    easing: Easing.inOut(Easing.exp),
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.background,
        { opacity: transitionValue },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            ...style,
            transform: [{ scale: transitionValue }],
          },
        ]}
      >
        {children}
      </Animated.View>
      {absoluteComponent && absoluteComponent()}
    </Animated.View>
  );
};

export default Overlay;

const styles = StyleSheet.create({
  container: {
    width: metrics.width * 0.8,
    height: metrics.height * 0.4,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: palette.secondary,
    padding: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  background: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 160,
    justifyContent: 'center',
  },
});
