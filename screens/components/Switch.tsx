import React, { useState, CSSProperties } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTransition } from 'react-native-redash';
import Animated, { Easing, interpolate } from 'react-native-reanimated';
import palette from '_palette';
import metrics from '_metrics';

const WIDTH = metrics.width * 0.15;
const HEIGHT = metrics.height * 0.03;

interface Props {
  left: string;
  right: string;
  onChange: (newValue: string) => void;
  initValue: boolean;
  style?: CSSProperties;
  width: number;
  height: number;
}

const Switch = ({
  left,
  right,
  onChange,
  initValue,
  style,
  width: newWidth,
  height: newHeight,
}: Props) => {
  const [swtich, setSwitch] = useState(initValue);
  const transitionValue = useTransition(swtich, {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
  });
  const width = newWidth ? newWidth : WIDTH;
  const height = newHeight ? newHeight : HEIGHT;
  const offsetX = interpolate(transitionValue, {
    inputRange: [0, 1],
    outputRange: [0, width],
  });
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setSwitch(!swtich);
        if (swtich) {
          onChange(left);
        } else {
          onChange(right);
        }
      }}
    >
      <Animated.View style={[styles.container, { height }, style]}>
        <Animated.View
          style={[
            styles.setter,
            {
              transform: [
                {
                  translateX: offsetX,
                },
              ],
              width,
            },
          ]}
        ></Animated.View>
        <View style={[styles.value, { width }]}>
          <Text style={styles.text}>{left}</Text>
        </View>
        <View style={[styles.value, { width }]}>
          <Text style={styles.text}>{right}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Switch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.secondaryDark,
    borderRadius: 20,
    flexDirection: 'row',
    height: HEIGHT,
  },
  value: {
    width: WIDTH,
    paddingHorizontal: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  setter: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
    borderRadius: 20,
    backgroundColor: palette.primary,
  },
  text: {
    fontSize: 17,
  },
});
