import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Divider, Text } from 'react-native-elements';
import typography from '_typography';
import palette from '_palette';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { workoutType } from '_types';
import { useNavigation } from '@react-navigation/native';

interface Props {
  divider: boolean;
  title: string;
  time: number;
  type: workoutType;
  workout_id: number;
}

const withZero = (num: number): string => {
  if (num >= 10) {
    return `${num}`;
  }

  return `0${num}`;
};

const formatTime = (time: number): string => {
  return `${withZero(Math.ceil(time / 60 / 60))}:${withZero(
    Math.ceil(time / 60) % 60,
  )}:${withZero(time % 60)}`;
};

const WorkoutItem = ({
  divider,
  title,
  time,
  type,
  workout_id,
}: Props) => {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('Creator', { workout_id });
      }}
    >
      <View>
        <View style={styles.infoContainer}>
          <Text>{title}</Text>
          {type === 'intervals' && (
            <Text style={styles.subText}>{formatTime(time)}</Text>
          )}
        </View>
        {divider && <Divider style={styles.divider} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WorkoutItem;

const styles = StyleSheet.create({
  divider: {
    height: 1.5,
    borderRadius: 1,
    backgroundColor: palette.grayscale.dark,
  },
  subText: {
    fontSize: typography.fontSize.small,
    color: palette.grayscale.light,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 8,
  },
});
