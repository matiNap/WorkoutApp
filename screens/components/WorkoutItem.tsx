import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Divider, Text } from 'react-native-elements';
import typography from '_typography';
import palette from '_palette';
import { workoutType } from '_types';
import { FontAwesome } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { connect } from 'react-redux';
import { deleteWorkout } from '_actions/creators/workout';
import { timerToString } from '_helpers';
import metrics from '_metrics';
import { useSpringTransition } from 'react-native-redash';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface Props {
  title: string;
  time: number;
  type: workoutType;
  id: string;
  editOpened: boolean;
  closeEdit: () => void;
  transitionValue?: Animated.Node<number>;
  deleteWorkout: typeof deleteWorkout;
  length: number;
  index: number;
  onPress: (id: string) => void;
  setEditOpened: (opened: boolean) => void;
}

const ITEM_HEIGHT = metrics.height * 0.08;

const WorkoutItem = ({
  title,
  time,
  type,
  id,
  editOpened,
  closeEdit,
  transitionValue,
  length,
  index,
  ...props
}: Props) => {
  const translateY = useSpringTransition(index * ITEM_HEIGHT, {});
  return (
    <Animated.View style={[styles.item, { transform: [{ translateY }] }]}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (props.onPress && !editOpened) props.onPress(id);
        }}
        onLongPress={() => {
          if (props.setEditOpened) props.setEditOpened(true);
        }}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          {editOpened && (
            <Animated.View
              style={{
                transform: [{ scale: transitionValue }],
                opacity: transitionValue,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  if (length === 1) closeEdit();

                  props.deleteWorkout(id);
                }}
              >
                <FontAwesome name="trash" style={styles.icon} />
              </TouchableWithoutFeedback>
            </Animated.View>
          )}
          {type === 'intervals' && time !== -1 && !editOpened && (
            <Text style={styles.subText}>{timerToString(time)}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default connect(null, { deleteWorkout })(WorkoutItem);

const styles = StyleSheet.create({
  subText: {
    fontSize: typography.fontSize.small,
    color: palette.grayscale.light,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
  },
  icon: {
    color: palette.text.primary,
    fontSize: 25,
  },
  item: {
    height: ITEM_HEIGHT,
    alignSelf: 'center',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
