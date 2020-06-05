import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Header from './components/Header';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import _ from 'lodash';
import palette from '_palette';
import ProgressBar from './components/ProgressBar';
import TimerClock from './components/Timer';
import { workout, exercise, todo, exerciseType, breakType } from '_types';
import reactotron from 'reactotronConfig';
import StateText from './components/StateText';
import ArcProgress from './components/ArcProgress';
import Animated from 'react-native-reanimated';
import metrics from '_metrics';
import TodoList from './components/TodoList';
import { Text } from 'react-native-elements';
import RepsInfo from './components/RepsInfo';
import { createExerciseTodoList } from '_helpers';

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
}

class Timer extends React.Component<Props, State> {
  state: State = {
    currentTime: 0,
    target: {
      currentTodo: {},
      index: 0,
      treshold: 1,
      type: 'reps',
    },
    currentLoop: 1,
    todoList: [],
    ended: false,
  };
  timer: NodeJS.Timeout;

  componentDidMount() {
    const { type, time, exercises, loop, exerciseBreak, typeBreak } = this.props.workout;

    this.timer = setInterval(() => {
      const { currentTime } = this.state;

      this.updateTimer();
      if (type === 'intervals' && time === currentTime) clearInterval(this.timer);
    }, 1000);

    const todoList = createExerciseTodoList(type, exercises, loop, exerciseBreak, typeBreak);

    if (todoList.length !== 0) {
      this.setState((prevState) => {
        return {
          target: { ...prevState.target, currentTodo: todoList[0], treshold: todoList[0].value },
          todoList,
        };
      });
    }
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
        };
      } else {
        return {
          ended: true,
        };
      }
    });
  };

  updateTimer() {
    this.setState((prevState) => {
      const { target, currentTime } = prevState;
      if (target.treshold === currentTime) this.updateTarget();
      return {
        currentTime: prevState.currentTime + 1,
      };
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const { currentTime, target, currentLoop, todoList } = this.state;
    const { type: targetType, currentTodo, treshold } = target;
    const { workout } = this.props;
    const { type: workoutType, time, loop } = workout;
    reactotron.log(this.state.target);
    return (
      <View style={styles.container}>
        <Header {...{ workout }} />
        {workoutType === 'intervals' ? (
          <ProgressBar progress={(currentTime / time) * 100} {...{ time, currentTime }} />
        ) : (
          <TimerClock size={30} style={styles.progressTimer} time={currentTime} />
        )}
        <View style={styles.currentTime}>
          {targetType !== 'reps' ? (
            <TimerClock size={40} style={styles.progressTimer} time={treshold - currentTime} />
          ) : (
            <RepsInfo value={currentTodo.value} onNext={() => {}} />
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

        {targetType !== 'reps' && (
          <View style={styles.arcProgress}>
            <ArcProgress
              progress={new Animated.Value(-((treshold - currentTime) / currentTodo.value))}
            />
          </View>
        )}
        <TodoList exercises={todoList} currentIndex={target.index} currentIndex={target.index} />
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
