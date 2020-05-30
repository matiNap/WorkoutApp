import React, { useState } from 'react';
import { Text } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTransition } from 'react-native-redash';
import metrics from '_metrics';
import TimeSelector from '_components/TimeSelector';
import palette from '_palette';
import Header from '_components/Header';
import typography from '_typography';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import stylesheet from '_stylesheet';
import Back from '_components/Back';
import Switch from '_components/Switch';
import {
  saveTypeWorkout,
  saveExerciseBreak,
  saveTypeBreak,
} from '_actions/creators/workout';
import reactotron from 'reactotron-react-native';
import { workoutType } from '_types';
import { connect } from 'react-redux';
import { fromTimer, timerToString } from '_helpers';

interface Props {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  saveTypeWorkout: typeof saveTypeWorkout;
  saveTypeBreak: typeof saveTypeBreak;
  saveExerciseBreak: typeof saveExerciseBreak;
  id: string;
  type: workoutType;
  typeBreak: number;
  exerciseBreak: number;
}

const SERIES_TYPE = 'Series';
const ROWS_TYPE = 'Interv';

const Settings = ({
  opened,
  setOpened,
  id,
  type,
  typeBreak,
  exerciseBreak,
  ...props
}: Props) => {
  const navigation = useNavigation();
  const transitionValue = useTransition(opened, {
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  });

  const translateY = interpolate(transitionValue, {
    inputRange: [0, 1],
    outputRange: [metrics.height, 0],
  });

  const [openedExcTimer, setOpenedExcTimer] = useState(false);
  const [openedTypeTimer, setOpenedTypeTimer] = useState(false);
  const [localType, setType] = useState(
    type === 'intervals' ? 'Interv' : 'Series',
  );
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          translateY,
        },
      ]}
    >
      <View style={styles.container}>
        <Header>
          <View style={stylesheet.row}>
            <Back
              onPress={() => {
                setOpened(false);
              }}
            />
            <Text style={styles.title}>Settings</Text>
          </View>
        </Header>
        <View style={styles.settingsContainer}>
          <View style={styles.setting}>
            <Text>Workout type</Text>
            <Switch
              left={SERIES_TYPE}
              right={ROWS_TYPE}
              onChange={(newValue) => {
                if (newValue === 'Interv') {
                  setType('Intervals');
                } else {
                  setType('Series');
                }
                props.saveTypeWorkout(
                  id,
                  newValue === 'Interv' ? 'intervals' : 'series',
                );
              }}
              initValue={type === 'intervals'}
            />
          </View>
          <View style={styles.setting}>
            <Text>Excerciese break</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                console.log('set opened');
                setOpenedExcTimer(true);
              }}
            >
              <Text style={styles.time}>
                {timerToString(exerciseBreak)}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.setting}>
            <Text>{`${localType} break`}</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                setOpenedTypeTimer(true);
              }}
            >
              <Text style={styles.time}>
                {timerToString(typeBreak)}
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {openedExcTimer ? (
          <TimeSelector
            title={'Excercise break:'}
            onConfirm={(minutes, seconds) => {
              props.saveExerciseBreak(
                id,
                fromTimer(minutes, seconds),
              );
            }}
            setOpened={setOpenedExcTimer}
            opened={openedExcTimer}
          />
        ) : null}
        {openedTypeTimer ? (
          <TimeSelector
            title={`${localType} break:`}
            setOpened={setOpenedTypeTimer}
            onConfirm={(minutes, seconds) => {
              props.saveTypeBreak(id, fromTimer(minutes, seconds));
            }}
            opened={openedTypeTimer}
          />
        ) : null}
      </View>
    </Animated.View>
  );
};

export default connect(null, {
  saveTypeWorkout,
  saveExerciseBreak,
  saveTypeBreak,
})(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.secondary,
  },
  settingsContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  title: {
    fontSize: typography.fontSize.header,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  setting: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  time: {
    color: palette.grayscale.light,
  },
});
