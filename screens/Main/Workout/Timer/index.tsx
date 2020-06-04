import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Header from './components/Header';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import _ from 'lodash';
import palette from '_palette';
import ProgressBar from './components/ProgressBar';
import TimerClock from './components/Timer';
import { workout } from '_types';
import reactotron from 'reactotronConfig';
import StateText from './components/StateText';
import ArcProgress from './components/ArcProgress';
import Animated from 'react-native-reanimated';
import metrics from '_metrics';
import TodoList from './components/TodoList';
import { Text } from 'react-native-elements';

interface Props {
  route: {
    params: {
      workoutId: string;
    };
  };
  workout: workout;
}

type timerType = 'break' | 'workout';

class Timer extends React.Component<Props> {
  state = {
    currentTime: 0,
    target: {
      type: '',
      name: '',
      index: 0,
      treshold: 1,
      isNextLoop: false,
      time: 1,
    },
    currentLoop: 1,
  };
  timer: NodeJS.Timeout;

  componentDidMount() {
    const { type, time, exercises } = this.props.workout;

    this.timer = setInterval(() => {
      const { currentTime } = this.state;

      this.updateTimer();
      if (type === 'intervals' && time === currentTime) clearInterval(this.timer);
    }, 1000);

    const firstExercise = exercises[0] ? exercises[0] : {};

    this.setState({
      target: {
        type: 'workout',
        treshold: parseInt(firstExercise.value),
        index: 0,
        name: firstExercise.name,
        time: firstExercise.value,
      },
    });
  }

  updateTimer() {
    this.setState((prevState) => {
      const { exercises, loop } = this.props.workout;
      const l = exercises.length;
      const { target, currentTime, currentLoop } = prevState;
      const { treshold, time } = target;

      if (currentTime === treshold && currentLoop <= loop) {
        const { typeBreak, exerciseBreak } = this.props.workout;
        const isNextLoop = l - 1 === target.index;
        const nextLoop = isNextLoop ? currentLoop + 1 : currentLoop;
        const tresholdOffset = isNextLoop ? typeBreak : exerciseBreak;

        const nextTarget =
          target.type === 'workout'
            ? {
                type: 'break',
                treshold: treshold + tresholdOffset,
                index: isNextLoop ? -1 : target.index,
                isNextLoop,
                time: tresholdOffset,
              }
            : {
                type: 'workout',
                treshold: treshold + parseInt(exercises[target.index + 1].value),
                index: target.index + 1,
                name: exercises[target.index + 1].name,
                time: parseInt(exercises[target.index + 1].value),
              };

        return {
          currentTime: prevState.currentTime + 1,
          target: nextTarget,
          currentLoop: nextLoop,
        };
      }
      return {
        currentTime: prevState.currentTime + 1,
      };
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const { currentTime, target, currentLoop } = this.state;
    const { type: targetType, name, isNextLoop, treshold, time: targetTime } = target;
    const { workout } = this.props;
    const { type: workoutType, time, exercises, loop } = workout;

    return (
      <View style={styles.container}>
        <Header {...{ workout }} />
        {workoutType === 'intervals' ? (
          <ProgressBar progress={(currentTime / time) * 100} {...{ time, currentTime }} />
        ) : (
          <TimerClock size={30} style={styles.progressTimer} time={currentTime} />
        )}
        <View style={styles.currentTime}>
          <TimerClock size={40} style={styles.progressTimer} time={treshold - currentTime} />
        </View>
        <View style={styles.info}>
          <StateText type={targetType} {...{ workoutType, name, isNextLoop }} />
          <Text style={styles.subText}>{`${
            workoutType === 'intervals' ? 'Interval' : 'Series'
          } ${currentLoop}/${loop}`}</Text>
        </View>

        <View style={styles.arcProgress}>
          <ArcProgress progress={new Animated.Value(-((treshold - currentTime) / targetTime))} />
        </View>
        <TodoList exercises={exercises} currentIndex={target.index} />
      </View>
    );
  }
}

const mapStatToProps = (state: RootState, ownProps: Props) => {
  const { workoutId } = ownProps.route.params;
  return {
    workout: state.workouts[_.findIndex(state.workouts, ({ id }) => id === workoutId)],
  };
};

export default connect(mapStatToProps)(Timer);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.secondary,
    paddingTop: StatusBar.currentHeight + 10,
    paddingHorizontal: 15,
  },
  progressTimer: {
    marginTop: 25,
  },
  info: {
    position: 'absolute',
    top: metrics.height / 2 + 50,
    alignSelf: 'center',
  },
  arcProgress: {
    top: metrics.height * 0.05,
  },
  currentTime: {
    position: 'absolute',
    top: metrics.height / 3,
    alignSelf: 'center',
  },
  subText: {
    color: palette.text.gray,
    fontSize: 19,
    alignSelf: 'center',
  },
});
