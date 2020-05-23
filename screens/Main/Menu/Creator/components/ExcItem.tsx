import React from 'react';
import { StyleSheet, View } from 'react-native';
import { exerciseType } from '_types';
import { Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import palette from '_palette';
import metrics from '_metrics';
import Animated, { useCode, Easing } from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {
  onGestureEvent,
  timing,
  approximates,
} from 'react-native-redash';

const { cond, set, add, eq, floor, multiply, divide } = Animated;

interface Props {
  title: string;
  value: string | number;
  listLength: number;
  type: exerciseType;
  translateY: Animated.Node<number>;
  index: number;
  values: Animated.Node<number>[];
}

const ITEM_HEIGHT = 55;

const ExcItem = ({
  title,
  type,
  value,
  translateY,
  listLength,
  index,
  values,
}: Props) => {
  const absoluteY = new Animated.Value(0);
  const currentIndex = new Animated.Value(index);
  const state = new Animated.Value(State.UNDETERMINED);
  const translationY = new Animated.Value(0);
  const to = new Animated.Value(0);
  const gestureHandler = onGestureEvent({
    absoluteY,
    state,
    translationY,
  });
  useCode(
    () => [
      cond(
        eq(state, State.ACTIVE),
        [
          set(
            translateY,
            add(multiply(currentIndex, ITEM_HEIGHT), translationY),
          ),
        ],
        cond(eq(state, State.END), [
          set(
            to,
            add(
              multiply(currentIndex, ITEM_HEIGHT),

              multiply(
                ITEM_HEIGHT,
                floor(divide(translationY, ITEM_HEIGHT)),
              ),
            ),
          ),
          set(
            translateY,
            timing({
              to,
              from: translateY,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
          cond(approximates(translateY, to), [
            set(
              currentIndex,
              add(
                currentIndex,
                floor(divide(translationY, ITEM_HEIGHT)),
              ),
            ),
          ]),
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
    paddingVertical: 5,
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
