import React, { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { exerciseType } from '_types';
import { Text } from 'react-native-elements';
import palette from '_palette';
import metrics from '_metrics';
import Animated, { useCode, interpolate, Extrapolate, call, block } from 'react-native-reanimated';
import { State, TouchableWithoutFeedback, PanGestureHandler } from 'react-native-gesture-handler';
import { onGestureEvent, approximates, useSpringTransition } from 'react-native-redash';
import { timerToString } from '_helpers';
import { connect } from 'react-redux';
import { deleteExercise, reorderExercises, editExercise } from '_actions/creators/workout';
import Switch from '_components/Switch';
import typography from '_typography';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { exercise } from '_types';
import reactotron from 'reactotronConfig';

const { cond, set, add, eq, floor, multiply, divide, debug, max, and } = Animated;

interface Props {
  title: string;
  value: string | number;
  listLength: number;
  type: exerciseType;
  currentOffset: Animated.Value<number>;
  myIndex: number;
  offsets: Animated.Value<number>[];
  onPressValue: () => void;
  onPressName: () => void;
  workout_id: string;
  deleteExercise: typeof deleteExercise;
  editExercise: typeof editExercise;
  reorderExercises: typeof reorderExercises;
  id: string;
  setPosition: (position: position, index: number) => void;
  editListOpened: boolean;
  editTransition: Animated.Value<number>;
  onLongPress: () => void;
  deleteLocalExercise: (index: number) => void;
  updateLocalExercise: (index: number, update: exercise) => void;
  otherItems: exercise[];
}

const ITEM_WIDTH = metrics.width * 0.95;
const ITEM_HEIGHT = metrics.excItemHeight;
const BORDER_RADIUS = metrics.excItemHeight * 0.2;

const withSnap = ({
  value,
  offset,
  state,
}: {
  value: Animated.Value<number>;
  offset: Animated.Value<number>;
  state: Animated.Value<number>;
}) => {
  const safeOffset = new Animated.Value(0);
  return block([cond(eq(state, State.ACTIVE), add(safeOffset, value), set(safeOffset, offset))]);
};

const ExcItem = ({
  title,
  type,
  value,
  currentOffset,
  listLength,
  myIndex,
  offsets,
  workout_id,
  id,
  onPressName,
  onPressValue,
  editListOpened,
  editTransition,
  onLongPress,
  otherItems,
  ...props
}: Props) => {
  const { state, gestureHandler, zIndex, translationY } = useMemo(() => {
    const state = new Animated.Value(State.UNDETERMINED);
    const zIndex = cond(eq(state, State.ACTIVE), 10, 1);
    const translationY = new Animated.Value(0);

    const gestureHandler = onGestureEvent({
      state,
      translationY,
    });

    return {
      state,
      translationY,
      gestureHandler,
      zIndex,
    };
  }, []);

  const y = max(withSnap({ value: translationY, offset: currentOffset, state }), 0);
  const offsetY = multiply(floor(divide(y, ITEM_HEIGHT)), ITEM_HEIGHT);

  const editWidth = interpolate(editTransition, {
    inputRange: [0, 1],
    outputRange: [40, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const reversedTransition = interpolate(editTransition, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const [animationEnded, setAnimationEnded] = useState(true);
  const translateY = useSpringTransition(y, {});
  useCode(
    () =>
      block([
        offsets.map((offset, index) => [
          cond(and(eq(offset, offsetY), eq(state, State.ACTIVE)), [
            call([], () => {
              if (index !== myIndex)
                props.reorderExercises(otherItems[index].id, otherItems[myIndex].id, workout_id);
            }),
            set(offset, currentOffset),
            set(currentOffset, offsetY),
          ]),
        ]),
        cond(
          approximates(editTransition, 0),
          call([], () => {
            setAnimationEnded(true);
          }),
          call([], () => {
            setAnimationEnded(false);
          }),
        ),
      ]),
    [currentOffset, offsetY, offsets, state],
  );
  return (
    <Animated.View style={[styles.swapContainer, { zIndex, transform: [{ translateY }] }]}>
      <View>
        <TouchableWithoutFeedback style={styles.container} {...{ onLongPress }}>
          <View style={{ flex: 1 }}>
            <View
              style={styles.header}
              ref={(ref) => {
                //Set x and y for edit overlay transition
                ref?.measure((fx, fy, width, height, px, py) => {
                  props.setPosition({ x: px, y: py }, myIndex);
                });
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  if (!editListOpened) onPressName();
                }}
                style={{ flexDirection: 'row' }}
              >
                <Animated.View style={{ width: editWidth }}>
                  <AntDesign name="edit" style={styles.editIcon} />
                </Animated.View>
                <Text style={[styles.text]}>{title}</Text>
              </TouchableWithoutFeedback>

              <Switch
                style={{ opacity: reversedTransition, scale: reversedTransition }}
                initValue={type === 'time'}
                left="Reps"
                right="Time"
                onChange={(newValue) => {
                  if (animationEnded) {
                    const type = newValue === 'Reps' ? 'reps' : 'time';
                    props.updateLocalExercise(myIndex, { type });
                    props.editExercise(workout_id, id, {
                      type,
                    });
                  }
                }}
              />
            </View>

            <Animated.View
              style={[
                styles.content,
                { opacity: reversedTransition, transform: [{ scale: reversedTransition }] },
              ]}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  if (!editListOpened) onPressValue();
                }}
              >
                {type === 'reps' ? (
                  <Text style={styles.subText}>{`x${value}`}</Text>
                ) : (
                  <Text style={styles.subText}>{timerToString(value)}</Text>
                )}
              </TouchableWithoutFeedback>
            </Animated.View>

            <Animated.View
              style={[
                styles.editListContent,
                { opacity: editTransition, transform: [{ scale: editTransition }] },
              ]}
            >
              <View style={{ flexGrow: 2, justifyContent: 'center' }}>
                <MaterialIcons
                  name="delete"
                  style={styles.deleteIcon}
                  onPress={() => {
                    if (!animationEnded) {
                      props.deleteLocalExercise(myIndex);
                      props.deleteExercise(workout_id, id);
                    }
                  }}
                />
              </View>
              <View
                style={{
                  height: 60,
                  width: 4,
                  borderRadius: 2,
                  backgroundColor: palette.text.gray,
                  alignSelf: 'center',
                  marginRight: 20,
                }}
              />
              <PanGestureHandler {...gestureHandler}>
                <Animated.View>
                  <MaterialIcons name="drag-handle" style={styles.icon} />
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Animated.View>
  );
};

export default connect(null, { deleteExercise, editExercise, reorderExercises })(ExcItem);

const styles = StyleSheet.create({
  swapContainer: {
    zIndex: 100,
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    left: 10,
  },
  container: {
    height: ITEM_HEIGHT * 0.9,
    width: ITEM_WIDTH,
    alignSelf: 'center',
    paddingVertical: 10,
    backgroundColor: palette.secondary,
    borderRadius: BORDER_RADIUS,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
    marginVertical: 5,
    paddingHorizontal: 10,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 150,
  },

  text: {
    fontSize: 20,
    color: palette.text.primary,
    fontFamily: typography.fonts.primary,
  },
  subText: {
    fontSize: 35,
    color: palette.grayscale.medium,
  },
  icon: {
    fontSize: 50,
    color: palette.text.primary,
    marginLeft: 10,
    alignSelf: 'center',
  },
  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    alignContent: 'center',
    zIndex: 100,
    position: 'absolute',
    bottom: ITEM_HEIGHT / 4,
  },
  editIcon: {
    color: palette.text.gray,
    fontSize: 25,
    marginRight: 10,
  },
  deleteIcon: { fontSize: 50, color: 'white', alignSelf: 'center' },
  editListContent: {
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    alignContent: 'center',
    position: 'absolute',
    bottom: ITEM_HEIGHT / 4,
  },
});
