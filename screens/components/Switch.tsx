import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTransition } from 'react-native-redash';
import Animated, {
  Easing,
  interpolate,
  useCode,
} from 'react-native-reanimated';
import palette from '_palette';
import typography from '_typography';

interface Props {
  left: string;
  right: string;
  setValue: (value: string) => void;
  initValue: string;
}

const { cond, eq, call } = Animated;

const Switch = ({ left, right, setValue, initValue }: Props) => {
  const [swtich, setSwitch] = useState(initValue === left);
  const transitionValue = useTransition(swtich, {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
  });
  const offsetX = interpolate(transitionValue, {
    inputRange: [0, 1],
    outputRange: [0, 65],
  });
  useCode(
    [
      cond(
        eq(transitionValue, 1),
        [
          call([], () => {
            setValue(right);
          }),
        ],
        call([], () => {
          setValue(left);
        }),
      ),
    ],
    [],
  );
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setSwitch(!swtich);
      }}
    >
      <View style={styles.container}>
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
      </View>
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
