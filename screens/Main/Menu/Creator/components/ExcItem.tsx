import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { exerciseType } from '_types';
import { Text } from 'react-native-elements';
import palette from '_palette';
import metrics from '_metrics';
import Animated, { useCode, Easing, interpolate, Extrapolate, call } from 'react-native-reanimated';
import { State, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { onGestureEvent, timing, approximates } from 'react-native-redash';
import { timerToString } from '_helpers';
import { connect } from 'react-redux';
import { deleteExercise } from '_actions/creators/workout';
import Switch from '_components/Switch';
import typography from '_typography';
import { editExercise } from '_actions/creators/workout';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const { cond, set, add, eq, floor, multiply, divide } = Animated;

interface Props {
  title: string;
  value: string | number;
  listLength: number;
  type: exerciseType;
  translateY: Animated.Node<number>;
  index: number;
  values: Animated.Node<number>[];
  onPressValue: () => void;
  onPressName: () => void;
  workout_id: string;
  deleteExercise: typeof deleteExercise;
  editExercise: typeof editExercise;
  id: string;
  setPosition: (position: position, index: number) => void;
  editListOpened: boolean;
  editTransition: Animated.Value<number>;
}

const ITEM_HEIGHT = metrics.height * 0.2;
const ITEM_WIDTH = metrics.width * 0.95;
const BORDER_RADIUS = ITEM_HEIGHT * 0.2;

const ExcItem = ({
  title,
  type,
  value,
  translateY,
  listLength,
  index,
  values,
  workout_id,
  id,
  onPressName,
  onPressValue,
  editListOpened,
  editTransition,
  ...props
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
        [set(translateY, add(multiply(currentIndex, ITEM_HEIGHT), translationY))],
        cond(eq(state, State.END), [
          set(
            to,
            add(
              multiply(currentIndex, ITEM_HEIGHT),

              multiply(ITEM_HEIGHT, floor(divide(translationY, ITEM_HEIGHT))),
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
            set(currentIndex, add(currentIndex, floor(divide(translationY, ITEM_HEIGHT)))),
          ]),
        ]),
      ),
    ],
    [],
  );
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
  useCode(
    () =>
      cond(
        approximates(editTransition, 0),
        call([], () => {
          setAnimationEnded(true);
        }),
        call([], () => {
          setAnimationEnded(false);
        }),
      ),
    [],
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View
          style={styles.header}
          ref={(ref) => {
            //Set x and y for edit overlay transition
            ref?.measure((fx, fy, width, height, px, py) => {
              props.setPosition({ x: px, y: py }, index);
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
                if (!animationEnded) props.deleteExercise(workout_id, id);
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
          <MaterialIcons name="drag-handle" style={styles.icon} />
        </Animated.View>
      </View>
    </View>
  );
};

export default connect(null, { deleteExercise, editExercise })(ExcItem);

const styles = StyleSheet.create({
  mainContainer: {
    zIndex: 100,
    width: ITEM_WIDTH,
    alignSelf: 'center',
  },
  container: {
    height: ITEM_HEIGHT,
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
