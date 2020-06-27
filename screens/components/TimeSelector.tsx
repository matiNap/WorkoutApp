import React from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { Text } from 'react-native-elements';
import ExitButtons from '_components/ExitButtons';
import Overlay from '_components/Overlay';
import NumberInput from '_components/NumberInput';
import { toTimer } from '_helpers';
import reactotron from 'reactotronConfig';

interface Props {
  title?: string;
  opened: boolean;
  setOpened: (opened: boolean) => void;
  onConfirm: (minutes: number, seconds: number) => void;
  initValue: number;
}
class TimeSelector extends React.Component<Props> {
  state = { minutes: 0, seconds: 1 };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
    const { opened, initValue } = this.props;
    if (opened) this.setState({ value: toTimer(initValue) });
  }
  backHandler = () => {
    if (this.props.opened) {
      this.props.setOpened(false);
      return true;
    }
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.opened !== this.props.opened) {
      const { initValue } = this.props;
      this.setState(toTimer(initValue));
    }
  }
  render() {
    const { title, setOpened, opened } = this.props;
    const { minutes, seconds } = this.state;
    if (!opened) return null;
    return (
      <Overlay {...{ opened, close: () => setOpened(false) }}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.rolls}>
            <View style={{ marginRight: 10 }}>
              <NumberInput
                maxRange={59}
                setValue={(minutes) => this.setState({ minutes })}
                value={minutes}
                updateValue={(offset) => {
                  this.setState((prevState) => {
                    const { minutes } = prevState;
                    if ((minutes > 0 && minutes < 59) || (minutes === 0 && offset === 1)) {
                      return { minutes: minutes + offset };
                    } else return {};
                  });
                }}
              />
              <Text style={styles.label}>Minutes</Text>
            </View>

            <View>
              <NumberInput
                maxRange={59}
                setValue={(seconds) => this.setState({ seconds })}
                value={seconds}
                updateValue={(offset) => {
                  this.setState((prevState) => {
                    const { seconds } = prevState;
                    if ((seconds > 0 && seconds < 59) || (seconds === 0 && offset === 1)) {
                      return { seconds: seconds + offset };
                    } else return {};
                  });
                }}
              />
              <Text style={styles.label}>Seconds</Text>
            </View>
          </View>
          <ExitButtons
            {...{ setOpened }}
            onConfirm={() => {
              const { minutes, seconds } = this.state;
              this.props.onConfirm(minutes, seconds);
            }}
          />
        </View>
      </Overlay>
    );
  }
}

export default TimeSelector;

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 160,
    top: 0,
    left: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rolls: {
    flexDirection: 'row',
    alignSelf: 'center',

    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 15,
    marginTop: 10,
    fontSize: 22,
    marginLeft: 15,
  },
  label: {
    fontSize: 15,
    marginTop: 5,
  },
});
