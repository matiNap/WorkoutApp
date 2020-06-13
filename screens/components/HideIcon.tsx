import React from 'react';
import { StyleSheet } from 'react-native';
import palette from '_palette';
import metrics from '_metrics';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { interpolate } from 'react-native-reanimated';

const SIZE = metrics.width * 0.17;

interface Props {
  transitionValue: Animated.Node<number>;
  onPress: () => void;
}

const LeftEditButton = ({ transitionValue, onPress }: Props) => {
  const offsetY = interpolate(transitionValue, {
    inputRange: [0, 1],
    outputRange: [SIZE + 30, 0],
  });
  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: offsetY }] },
      ]}
    >
      <FontAwesome
        name="remove"
        style={styles.icon}
        {...{ onPress }}
      />
    </Animated.View>
  );
};

export default LeftEditButton;

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE,
    backgroundColor: palette.grayscale.light,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    right: metrics.width / 2 - SIZE / 2,
  },
  icon: {
    alignSelf: 'center',
    color: palette.secondary,
    fontSize: 32,
  },
});
