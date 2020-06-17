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

interface Props {
  divider: boolean;
  title: string;
  time: number;
  type: workoutType;
  id: string;
  editOpened: boolean;
  closeEdit: () => void;
  transitionValue?: Animated.Node<number>;
  deleteWorkout: typeof deleteWorkout;
  length: number;
}

const WorkoutItem = ({
  divider,
  title,
  time,
  type,
  id,
  editOpened,
  closeEdit,
  transitionValue,
  length,
  ...props
}: Props) => {
  return (
    <View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        {editOpened && (
          <Animated.View
            style={{
              transform: [{ scale: transitionValue }],
              opacity: transitionValue,
            }}
          >
            <FontAwesome
              name="trash"
              style={styles.icon}
              onPress={() => {
                if (length === 1) closeEdit();

                props.deleteWorkout(id);
              }}
            />
          </Animated.View>
        )}
        {type === 'intervals' ||
          (time !== -1 && !editOpened && <Text style={styles.subText}>{timerToString(time)}</Text>)}
      </View>
    </View>
  );
};

export default connect(null, { deleteWorkout })(WorkoutItem);

const styles = StyleSheet.create({
  divider: {
    height: 1.5,
    borderRadius: 1,
    backgroundColor: palette.grayscale.medium,
  },
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
});
