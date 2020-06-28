import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { todo } from '_types';
import Animated, {
  useCode,
  interpolate,
  Extrapolate,
  cond,
  eq,
  lessOrEq,
  Easing,
  set,
  greaterOrEq,
  add,
} from 'react-native-reanimated';
import palette from '_palette';
import metrics from '_metrics';
import { timerToString } from '_helpers';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { onGestureEvent, timing } from 'react-native-redash';
import typography from '_typography';

interface Props {
  exercises: todo[];
  currentIndex: number;
}

const renderNextState = (exercises: todo[], currentIndex: number, nextEnded: boolean) => {
  if (nextEnded) {
    return <Text style={styles.stateEnded}>END</Text>;
  }
  if (currentIndex + 1 === exercises.length) return <Text>{exercises[0].name}</Text>;
  else if (
    exercises[currentIndex + 1].type === 'break' ||
    exercises[currentIndex + 1].type === 'typeBreak'
  )
    return <Text>Break</Text>;
  else return <Text>{exercises[currentIndex + 1].name}</Text>;
};

const ALinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ITEM_HEIGHT = metrics.height * 0.1;
const HEADER_HEIGHT = metrics.height * 0.14;
const LINEAR_MIN_HEIGHT = HEADER_HEIGHT * 1.2;

const TodoList = ({ exercises, currentIndex }: Props) => {
  const minHeight = metrics.height * 0.7;
  const offsetTarget = -metrics.height * 0.5;

  const nextEnded = exercises.length - 1 === currentIndex;
  const { offsetY, gestureHandler, translateY, state, linearHeight } = useMemo(() => {
    const offsetY = new Animated.Value(0);
    const translateY = new Animated.Value(0);
    const state = new Animated.Value(State.UNDETERMINED);
    const linearHeight = interpolate(offsetY, {
      inputRange: [offsetTarget, 0],
      outputRange: [metrics.height, LINEAR_MIN_HEIGHT],
    });

    return {
      offsetY,
      gestureHandler: onGestureEvent({ translationY: translateY, state }),
      translateY,
      state,
      linearHeight,
    };
  }, []);
  useCode(
    () => [
      cond(eq(state, State.END), [
        cond(
          lessOrEq(translateY, -80),
          set(
            offsetY,
            timing({
              from: offsetY,
              to: offsetTarget,
              duration: 300,
              easing: Easing.inOut(Easing.exp),
            }),
          ),
          set(
            offsetY,
            timing({
              from: offsetY,
              to: 0,
              duration: 300,
              easing: Easing.inOut(Easing.exp),
            }),
          ),
        ),
      ]),
      cond(
        eq(state, State.ACTIVE),
        cond(
          greaterOrEq(offsetY, -minHeight / 2),
          [
            set(
              offsetY,
              interpolate(translateY, {
                inputRange: [-metrics.height, 0],
                outputRange: [offsetTarget, 0],
                extrapolate: Extrapolate.CLAMP,
              }),
            ),
          ],
          set(
            offsetY,
            interpolate(translateY, {
              inputRange: [0, metrics.height],
              outputRange: [offsetTarget, 0],
              extrapolate: Extrapolate.CLAMP,
            }),
          ),
        ),
      ),
    ],
    [],
  );
  return (
    <View
      style={{
        position: 'absolute',
        height: metrics.height,
        top: metrics.height - HEADER_HEIGHT,
        width: metrics.width,
      }}
    >
      <ALinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: linearHeight,
        }}
      />

      <Animated.View
        pointerEvents="auto"
        style={[styles.container, { minHeight, transform: [{ translateY: offsetY }] }]}
      >
        <PanGestureHandler {...gestureHandler}>
          <Animated.View style={[styles.header]}>
            <View style={styles.swipeBar}></View>
            {exercises.length !== 0 && (
              <View style={styles.headerText}>
                <Text>Next:</Text>
                {renderNextState(exercises, currentIndex, nextEnded)}
              </View>
            )}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: 2000 }}
        style={[
          styles.listContainer,
          { transform: [{ translateY: add(offsetY, HEADER_HEIGHT) }], height: 1000 },
        ]}
      >
        {exercises.map((exercise, index) => {
          const currentStyle = currentIndex === index ? styles.currentText : styles.otherText;
          if (exercise.type === 'break' || exercise.type === 'typeBreak')
            return (
              <Text
                style={[styles.breakText, currentStyle]}
                key={`next${index}`}
              >{`Break ${timerToString(exercise.value)}`}</Text>
            );
          return (
            <View style={styles.itemContainer} key={`next${index}`}>
              <Text style={currentStyle}>{exercise.name}</Text>
              {exercise.type === 'reps' ? (
                <Text style={[styles.subText, currentStyle]}>x{exercise.value}</Text>
              ) : (
                <Text style={[styles.subText, currentStyle]}>{timerToString(exercise.value)}</Text>
              )}
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.secondaryDark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: metrics.width,
    position: 'absolute',
    top: 0,
  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    height: ITEM_HEIGHT,
  },
  listContainer: {
    marginTop: 5,
    paddingHorizontal: 10,
  },
  header: {
    borderRadius: 10,
    backgroundColor: palette.secondary,
    paddingHorizontal: 5,
    height: HEADER_HEIGHT,
  },
  headerText: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  subText: {
    color: palette.text.gray,
    alignSelf: 'center',
  },
  swipeBar: {
    backgroundColor: palette.text.primary,
    alignSelf: 'center',
    width: '30%',
    borderRadius: 10,
    height: 5,
  },
  breakText: {
    color: palette.text.gray,
    fontSize: 14,
    alignSelf: 'center',
  },
  currentText: {
    color: palette.primary,
    fontFamily: typography.fonts.primary,
    alignSelf: 'center',
  },
  otherText: { fontFamily: typography.fonts.primary, alignSelf: 'center' },
  stateEnded: {
    color: palette.primary,
  },
});
