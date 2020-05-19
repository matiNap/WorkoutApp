import React from 'react';
import { StyleSheet, View } from 'react-native';
import { excerciseType } from '_types';
import { Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import palette from '_palette';
import metrics from '_metrics';
import Animated, {
  useCode,
  Easing,
  abs,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {
  onGestureEvent,
  usePanGestureHandler,
  timing,
} from 'react-native-redash';

const {
  cond,
  set,
  add,
  eq,
  floor,
  multiply,
  divide,
  debug,
} = Animated;

interface Props {
  title: string;
  value: string | number;
  listLength: number;
  type: excerciseType;
  translateY: Animated.Node<number>;
  index: number;
}

const ITEM_HEIGHT = 50;

const ExcItem = ({
  title,
  type,
  value,
  translateY,
  listLength,
  index,
}: Props) => {
  const absoluteY = new Animated.Value(0);
  const currentIndex = new Animated.Value(index);
  const state = new Animated.Value(State.UNDETERMINED);
  const translationY = new Animated.Value(0);
  const gestureHandler = onGestureEvent({
    absoluteY,
    state,
    translationY,
  });
  useCode(
    [
      cond(
        eq(state, State.ACTIVE),
        [set(translateY, translationY)],
        cond(eq(state, State.END), [
          set(
            translateY,
            timing({
              to: add(
                multiply(currentIndex, ITEM_HEIGHT),

                multiply(
                  ITEM_HEIGHT,
                  floor(divide(translationY, ITEM_HEIGHT)),
                ),
              ),
              from: translateY,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
          set(
            currentIndex,
            add(
              currentIndex,
              floor(divide(translationY, ITEM_HEIGHT)),
            ),
          ),
        ]),
      ),
    ],
    [],
  );

  return (
    <Animated.View style={[styles.container, { translateY }]}>
      <View style={styles.left}>
        <Text style={styles.text}>{title}</Text>
        {type === 'reps' ? (
          <Text style={styles.subText}>{`Reps: ${value}`}</Text>
        ) : (
          <Text style={styles.subText}>{`Time: ${value}`}</Text>
        )}
      </View>

      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={styles.right}>
          <MaterialIcons name="drag-handle" style={styles.icon} />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default ExcItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    width: metrics.width * 0.95,
    alignSelf: 'center',

    backgroundColor: palette.secondary,
  },
  left: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: '100%',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  subText: {
    fontSize: 15,
    color: palette.grayscale.medium,
  },
  icon: {
    fontSize: 32,
    color: palette.text.primary,
    marginLeft: 10,
  },
});
