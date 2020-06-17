import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import palette from '_palette';

interface Props {
  endStart: () => void;
}

interface State {
  time: number;
}

class StartScreen extends React.Component<Props, State> {
  state = {
    time: 1,
  };
  timer: NodeJS.Timeout;
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.time === 3) {
          clearInterval(this.timer);
          this.props.endStart();
        }

        return {
          time: prevState.time + 1,
        };
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        <Text style={styles.counter}>{this.state.time === 4 ? 3 : this.state.time}</Text>
      </View>
    );
  }
}

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  counter: {
    fontSize: 120,
    color: palette.text.primary,
    alignSelf: 'center',
  },
});
