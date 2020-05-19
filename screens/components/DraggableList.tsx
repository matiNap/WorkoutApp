import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

interface Props {
  data: any[];
  renderItem: ({
    data,
    translateY,
  }: {
    data: any;
    index: number;
    translateY: Animated.Node<number>;
  }) => ReactNode;
}

class DraggableList extends React.Component<Props> {
  values: Animated.Value<0>[];
  constructor(props: Props) {
    super(props);
    const { data } = props;
    this.values = data.map(() => new Animated.Value(0));
  }
  render() {
    const { data, renderItem } = this.props;

    return (
      <Animated.ScrollView contentContainerStyle={{ flex: 1 }}>
        {data.map((currentData, index) =>
          renderItem({
            data: currentData,
            translateY: this.values[index],
            index,
          }),
        )}
      </Animated.ScrollView>
    );
  }
}

export default DraggableList;

const styles = StyleSheet.create({});
