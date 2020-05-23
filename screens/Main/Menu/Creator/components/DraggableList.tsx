import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import ExcItem from './ExcItem';
import { workout } from '_types';

interface Props {
  data: workout[];
}

class DraggableList extends React.Component<Props> {
  values: Animated.Value<0>[];
  constructor(props: Props) {
    super(props);
    const { data } = props;
    this.values = data.map(() => new Animated.Value(0));
  }
  render() {
    const { data } = this.props;

    return (
      <Animated.ScrollView contentContainerStyle={{ flex: 1 }}>
        {data.map((data, index) => (
          <ExcItem
            {...{ translateY: this.values[index], index }}
            value={data.value}
            title={data.title}
            type={data.type}
            listLength={data.length}
            values={this.values}
            key={`exc${index}`}
          />
        ))}
      </Animated.ScrollView>
    );
  }
}

export default DraggableList;

const styles = StyleSheet.create({});
