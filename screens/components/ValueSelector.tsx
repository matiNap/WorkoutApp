import React from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { Text } from 'react-native-elements';
import ExitButtons from '_components/ExitButtons';
import Overlay from '_components/Overlay';
import NumberInput from './NumberInput';

interface Props {
  title?: string;
  opened: boolean;
  setOpened: (opened: boolean) => void;
  onConfirm: (value: number) => void;
}
class TimeSelector extends React.Component<Props> {
  state = { value: 1, textValue: 'x01' };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
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
      this.setState({ value: 0 });
    }
  }
  render() {
    const { title, setOpened, opened } = this.props;
    const { value } = this.state;
    if (!opened) return null;
    return (
      <Overlay {...{ opened, close: () => setOpened(false) }}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.rolls}>
            <NumberInput
              {...{ value }}
              setValue={(value) => {
                this.setState({ value });
              }}
            />
          </View>
          <ExitButtons
            {...{ setOpened }}
            onConfirm={() => {
              const { value } = this.state;
              this.props.onConfirm(value);
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
});
