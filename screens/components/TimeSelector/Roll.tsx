import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated, { useCode } from 'react-native-reanimated';
import palette from '_palette';
import { Text } from 'react-native-elements';
import {
  usePanGestureHandler,
  useValue,
  snapPoint,
  timing,
  string,
} from 'react-native-redash';
import metrics from '_metrics';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  range: number[];
  setIndex: (val: number) => void;
  label: string;
}

const {
  cond,
  eq,
  add,
  set,
  Clock,
  clockRunning,
  not,
  floor,
  divide,
  call,
} = Animated;

const CELL_HEIGHT = 40;

const AText = Animated.createAnimatedComponent(Text);

const Roll = ({ range, setIndex, label }: Props) => {
  const clock = new Clock();
  const values = range;
  const maxHeight = values.length * CELL_HEIGHT;
  const snapPoints = values.map((_, i) => (i - 1) * -CELL_HEIGHT);
  const translationY = useValue(0);
  const offsetY = useValue(0);
  const {
    gestureHandler,
    state,
    velocity,
    translation,
  } = usePanGestureHandler();
  const currentIndex = useValue(0);
  const to = snapPoint(translationY, velocity.y, snapPoints);
  useCode(
    () => [
      cond(eq(state, State.ACTIVE), [
        set(translationY, add(offsetY, translation.y)),
      ]),
      cond(eq(state, State.END), [
        set(offsetY, translationY),
        set(translationY, timing({ clock, from: translationY, to })),
        cond(not(clockRunning(clock)), [
          set(
            currentIndex,
            add(floor(divide(translationY, -CELL_HEIGHT)), 1),
          ),
          call([currentIndex], ([val]) => {
            setIndex(val);
          }),
        ]),
      ]),
    ],
    [],
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <LinearGradient
          colors={[palette.secondary, 'transparent']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 60,
            zIndex: 160,
          }}
          pointerEvents="box-only"
        />
        <LinearGradient
          colors={['transparent', palette.secondary]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 70,
            zIndex: 160,
          }}
          pointerEvents="box-only"
        />
        <PanGestureHandler {...gestureHandler}>
          <Animated.View
            style={{
              height: maxHeight,
            }}
          >
            <Animated.View
              style={[
                styles.valueContainer,
                { transform: [{ translateY: translationY }] },
              ]}
            >
              {values.map((value) => {
                return (
                  <AText style={styles.number} key={value}>
                    {value}
                  </AText>
                );
              })}
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default Roll;

const styles = StyleSheet.create({
  mainContainer: {
    width: metrics.width * 0.25,
  },
  container: {
    height: 3 * CELL_HEIGHT,
    overflow: 'hidden',
  },
  number: {
    fontSize: 27,
    color: palette.text.primary,
    paddingVertical: 5,
    height: CELL_HEIGHT,
  },
  valueContainer: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  label: {
    alignSelf: 'center',
    fontSize: 15,
  },
  hiddenValue: {
    opacity: 0.5,
  },
});
