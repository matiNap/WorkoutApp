import React from 'react';
import { StyleSheet, View } from 'react-native';
import { exerciseType } from '_types';
import { Text } from 'react-native-elements';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import palette from '_palette';
import metrics from '_metrics';
import Animated, { useCode, Easing } from 'react-native-reanimated';
import { PanGestureHandler, State, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { onGestureEvent, timing, approximates } from 'react-native-redash';
import { timerToString } from '_helpers';
import { connect } from 'react-redux';
import { deleteExercise } from '_actions/creators/workout';

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
  id: string;
}

const ITEM_HEIGHT = metrics.height * 0.12;

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

  return (
    <TouchableWithoutFeedback {...{ onPress }} style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
      <Animated.View style={[styles.container, { translateY }]}>
        <View style={styles.header}>
          <Text style={styles.text}>{title}</Text>
          <AntDesign name="edit" style={styles.editIcon} />
        </View>
        <View style={styles.content}>
          {type === 'reps' ? (
            <Text style={styles.subText}>{`x${value}`}</Text>
          ) : (
            <Text style={styles.subText}>{timerToString(value)}</Text>
          )}
        </View>
      </Animated.View>
      {/* <MaterialIcons
        name="delete"
        style={{ fontSize: 30, color: 'white' }}
        onPress={() => {
          props.deleteExercise(workout_id, id);
        }}
      /> */}
    </TouchableWithoutFeedback>
  );
};

export default connect(null, { deleteExercise })(ExcItem);

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    width: metrics.width * 0.95,
    alignSelf: 'center',
    paddingVertical: 5,
    backgroundColor: palette.secondary,
    borderRadius: ITEM_HEIGHT * 0.2,
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
  },
  header: {
    flexDirection: 'row',
  },

  text: {
    fontSize: 20,
  },
  subText: {
    fontSize: 24,
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
