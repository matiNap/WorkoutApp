import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { exerciseType } from '_types';
import { Text } from 'react-native-elements';
import palette from '_palette';
import metrics from '_metrics';
import Animated, { useCode, Easing, SpringUtils, interpolate } from 'react-native-reanimated';
import { PanGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { onGestureEvent, timing, approximates, useSpringTransition } from 'react-native-redash';
import { timerToString } from '_helpers';
import { connect } from 'react-redux';
import { deleteExercise } from '_actions/creators/workout';
import Switch from '_components/Switch';
import typography from '_typography';
import { editExercise } from '_actions/creators/workout';
import reactotron from 'reactotron-react-native';

const { cond, set, add, eq, floor, multiply, divide } = Animated;

interface Props {
  title: string;
  value: string | number;
  listLength: number;
  type: exerciseType;
  translateY: Animated.Node<number>;
  index: number;
  values: Animated.Node<number>[];
  onPress: () => void;
  workout_id: string;
  deleteExercise: typeof deleteExercise;
  editExercise: typeof editExercise;
  id: string;
  setPosition: (position: { x: number; y: number }, index: number) => void;
  swtichExpanded: () => void;
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
  onPress,
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

  const [expaneded, setExpanded] = useState(false);

  const [containerY, setContainerY] = useState(0);
  const testTransition = useSpringTransition(expaneded, SpringUtils.makeDefaultConfig());
  const expandHeight = interpolate(testTransition, {
    inputRange: [0, 1],
    outputRange: [ITEM_HEIGHT, metrics.height],
  });
  const translateContainerY = interpolate(testTransition, {
    inputRange: [0, 1],
    outputRange: [0, -containerY],
  });

  return (
    <View
      style={styles.mainContainer}
      ref={(ref) => {
        //Set x and y for expand transition
        ref?.measure((fx, fy, width, height, px, py) => {
          setContainerY(py);
        });
      }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            height: expandHeight,
            transform: [{ translateY: translateContainerY }],
          },
        ]}
      >
        <View
          style={styles.header}
          ref={(ref) => {
            //Set x and y for edit overlay transition
            ref?.measure((fx, fy, width, height, px, py) => {
              props.setPosition({ x: px, y: py }, index);
            });
          }}
        >
          <TouchableWithoutFeedback onPress={onPress}>
            <Text style={[styles.text]}>{title}</Text>
          </TouchableWithoutFeedback>
          <Switch
            initValue={type === 'time'}
            left="Reps"
            right="Time"
            onChange={(newValue) => {
              const type = newValue === 'Reps' ? 'reps' : 'time';
              props.editExercise(workout_id, id, {
                type,
              });
            }}
          />
        </View>

        <View style={styles.content}>
          <TouchableWithoutFeedback
            onPress={() => {
              setExpanded(!expaneded);
              props.swtichExpanded();
            }}
            style={{ flex: 1 }}
          >
            {type === 'reps' ? (
              <Text style={styles.subText}>{`x${value}`}</Text>
            ) : (
              <Text style={styles.subText}>{timerToString(value)}</Text>
            )}
          </TouchableWithoutFeedback>
        </View>

        {/* <MaterialIcons
        name="delete"
        style={{ fontSize: 30, color: 'white' }}
        onPress={() => {
          props.deleteExercise(workout_id, id);
        }}
      /> */}
      </Animated.View>
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
    fontSize: 32,
    color: palette.text.primary,
    marginLeft: 10,
  },
  content: {
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  editIcon: {
    color: palette.text.gray,
    fontSize: 20,
  },
});
