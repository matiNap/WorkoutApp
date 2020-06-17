import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Header from './components/Header';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import _ from 'lodash';
import palette from '_palette';
import ProgressBar from './components/ProgressBar';
import TimerClock from './components/Timer';
import { workout, todo, exerciseType, breakType } from '_types';

import StateText from './components/StateText';
import ArcProgress from './components/ArcProgress';
import Animated from 'react-native-reanimated';
import metrics from '_metrics';
import TodoList from './components/TodoList';
import { Text } from 'react-native-elements';
import RepsInfo from './components/RepsInfo';
import { createExerciseTodoList } from '_helpers';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import Overlay from '_components/Overlay';
import ExitButtons from '_components/ExitButtons';
import typography from '_typography';
import StartScreen from './components/StartScreen';
import { Audio } from 'expo-av';

interface Props {
  route: {
    params: {
      workoutId: string;
    };
  };
  workout: workout;
}

interface State {
  currentTime: number;
  target: {
    currentTodo: todo | null;
    index: number;
    treshold: number;
    type: exerciseType | breakType;
  };
  currentLoop: number;
  todoList: todo[];
  ended: boolean;
  stopped: boolean;
  currentWorkoutTime: number;
  exitOpened: boolean;
  start: boolean;
}

const AUDIO_PATH = '../../../../assets/audio';

class Timer extends React.Component<Props, State> {
  state: State = {
    currentTime: 0,
    currentWorkoutTime: 0,
    target: {
      currentTodo: {},
      index: 0,
      treshold: 1,
      type: 'reps',
    },
    currentLoop: 1,
    todoList: [],
    ended: false,
    exitOpened: false,
    start: true,
  };
  timer: NodeJS.Timeout;
  currentTimer: NodeJS.Timeout;
  alarm = new Audio.Sound();

  async componentDidMount() {
    const { type, exercises, loop, exerciseBreak, typeBreak } = this.props.workout;

    const todoList = createExerciseTodoList(type, exercises, loop, exerciseBreak, typeBreak);

    if (todoList.length !== 0) {
      this.setState((prevState) => {
        return {
          target: {
            ...prevState.target,
            currentTodo: todoList[0],
            treshold: todoList[0].value,
            type: todoList[0].type,
          },
          todoList,
        };
      });
    }

    try {
      await this.alarm.loadAsync(require(`${AUDIO_PATH}/beep.mp3`));
      await this.alarm.setVolumeAsync(0.1);
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidUpdate(_, prevState: State) {
    const { type, time } = this.props.workout;
    if (prevState.start !== this.state.start) {
      this.timer = setInterval(async () => {
        const { currentTime, stopped, ended, exitOpened } = this.state;

        if (!stopped && !ended && !exitOpened) {
          this.updateTimer();
        }
        if (type === 'intervals' && time === currentTime + 1) {
          this.setState({ ended: true });
          clearInterval(this.timer);
        }
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateTarget = () => {
    this.setState((prevState) => {
      const { todoList, target } = prevState;
      const { index } = target;

      if (index + 1 <= todoList.length - 1) {
        const nextTodo = todoList[index + 1];
        return {
          target: {
            currentTodo: nextTodo,
            index: index + 1,
            type: nextTodo.type,
            treshold: target.treshold + nextTodo.value,
          },
          currentLoop:
            nextTodo.type === 'typeBreak' ? prevState.currentLoop + 1 : prevState.currentLoop,
          currentWorkoutTime: 0,
        };
      } else {
        return {
          ended: true,
        };
      }
    });
  };

  async playAlarm() {
    try {
      await this.alarm.replayAsync();
    } catch (error) {
      console.log(error.message);
    }
  }

  updateTimer() {
    this.setState((prevState) => {
      const { target, currentTime } = prevState;
      if (prevState.currentWorkoutTime === target.currentTodo?.value && target.type !== 'reps') {
        this.playAlarm();
        this.updateTarget();
      }
      const currentWorkoutTime =
        prevState.currentWorkoutTime === target.currentTodo?.value || target.type === 'reps'
          ? 0
          : prevState.currentWorkoutTime + 1;
      return {
        currentTime: currentTime + 1,
        currentWorkoutTime,
      };
    });
  }

  renderTimer() {
    const { stopped, currentWorkoutTime } = this.state;
    if (!stopped) {
      return <TimerClock size={40} style={styles.progressTimer} time={currentWorkoutTime} />;
    }
    return <FontAwesome name="pause" style={styles.pause} />;
  }

  renderWorkoutState = () => {
    const { workout } = this.props;
    const { ended, currentLoop, target, currentWorkoutTime } = this.state;
    const { type: targetType, currentTodo } = target;
    const { loop, type: workoutType, time: workoutTime } = workout;

    if (ended) {
      return (
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Text style={styles.mainTextEnded}>END</Text>
        </View>
      );
    } else {
      return (
        <View>
          {targetType !== 'reps' ||
            (workoutTime !== -1 && (
              <View style={styles.arcProgress}>
                <ArcProgress
                  progress={new Animated.Value(1 - -currentWorkoutTime / currentTodo.value)}
                />
              </View>
            ))}
          <View style={styles.currentTime}>
            {targetType !== 'reps' ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState((prevState) => ({ stopped: !prevState.stopped }));
                }}
              >
                {this.renderTimer()}
              </TouchableWithoutFeedback>
            ) : (
              <RepsInfo value={currentTodo.value} onNext={this.updateTarget} />
            )}
          </View>
          <View style={styles.info}>
            <StateText
              type={targetType}
              {...{ workoutType }}
              name={currentTodo.name}
              isNextLoop={targetType === 'typeBreak'}
            />
            <Text style={styles.subText}>{`${
              workoutType === 'intervals' ? 'Interval' : 'Series'
            } ${currentLoop}/${loop}`}</Text>
          </View>
        </View>
      );
    }
  };

  render() {
    const { currentTime, target, todoList, exitOpened, start } = this.state;
    const { workout, navigation } = this.props;
    const { type: workoutType, time } = workout;
    const { goBack } = navigation;
    if (start) {
      return (
        <StartScreen
          endStart={() => {
            this.setState({ start: false });
          }}
        />
      );
    }
    return (
      <View style={styles.container}>
        <Header
          {...{ workout }}
          onRequestClose={() => {
            this.setState({ exitOpened: true });
          }}
        />
        {workoutType === 'intervals' ? (
          <ProgressBar progress={(currentTime / time) * 100} {...{ time, currentTime }} />
        ) : (
          <TimerClock size={30} style={styles.progressTimer} time={currentTime} />
        )}
        {this.renderWorkoutState()}
        <TodoList exercises={todoList} currentIndex={target.index} currentIndex={target.index} />
        <Overlay
          opened={exitOpened}
          close={() => this.setState({ exitOpened: false })}
          style={styles.overlay}
        >
          <Text style={styles.exitText}>Are you sure to end workout?</Text>

          <ExitButtons
            setOpened={(opened) => {
              this.setState({ exitOpened: opened });
            }}
            onCancel={() => this.setState({ exitOpened: false })}
            onConfirm={() => {
              goBack();
            }}
          />
        </Overlay>
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
    top: metrics.height / 2.5,
    alignSelf: 'center',
  },
  arcProgress: {
    top: metrics.height * 0.05,
  },
  currentTime: {
    position: 'absolute',
    top: metrics.height * 0.18,
    alignSelf: 'center',
  },
  subText: {
    color: palette.text.gray,
    fontSize: 19,
    alignSelf: 'center',
  },
  mainTextEnded: {
    fontSize: 50,
    color: palette.primary,
    alignSelf: 'center',
  },
  pause: {
    fontSize: 50,
    color: palette.text.primary,
  },
  exitText: {
    fontSize: typography.fontSize.big,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 5,
  },
  overlay: {
    height: metrics.height * 0.25,
    alignItems: 'center',
  },
});
