import React, { useState, CSSProperties } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTransition } from 'react-native-redash';
import Animated, { Easing, interpolate } from 'react-native-reanimated';
import palette from '_palette';

interface Props {
  left: string;
  right: string;
  onChange: (newValue: string) => void;
  initValue: boolean;
  style?: CSSProperties;
}

const Switch = ({ left, right, onChange, initValue, style }: Props) => {
  const [swtich, setSwitch] = useState(initValue);
  const transitionValue = useTransition(swtich, {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
  });
  const offsetX = interpolate(transitionValue, {
    inputRange: [0, 1],
    outputRange: [0, 65],
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
      <Animated.View style={[styles.container, style]}>
        <Animated.View
          style={[
            styles.setter,
            {
              transform: [
                {
                  translateX: offsetX,
                },
              ],
            },
          ]}
        ></Animated.View>
        <View style={styles.value}>
          <Text>{left}</Text>
        </View>
        <View style={styles.value}>
          <Text>{right}</Text>
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
    height: 25,
  },
  value: {
    width: 65,
    alignItems: 'center',
  },
  setter: {
    position: 'absolute',
    width: 65,
    height: 25,
    borderRadius: 20,
    backgroundColor: palette.primary,
  },
});
