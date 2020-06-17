import React, { useState } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { Text } from 'react-native-elements';
import Roll from '_components/TimeSelector/Roll';
import ExitButtons from '_components/ExitButtons';
import Overlay from '_components/Overlay';
import { createRange } from '_helpers';
import { position } from '_types';

const RANGE = createRange(0, 60);

interface Props {
  title?: string;
  opened: boolean;
  setOpened: (opened: boolean) => void;
  onConfirm: (value: number) => void;
}
class TimeSelector extends React.Component<Props> {
  state = { value: 0 };
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
    if (!opened) return null;
    return (
      <Overlay {...{ opened, close: () => setOpened(false) }}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.rolls}>
            <Roll range={RANGE} setIndex={(value) => this.setState({ value })} label="" />
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
