import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ExcItem from './ExcItem';
import { workout, exercise } from '_types';
import Edit from './Edit';
import AddButton from './AddButton';

interface Props {
  data: exercise[];
  id: string;
  addButton: ({ addValue }: { addValue: () => void }) => ReactNode;
}

class DraggableList extends React.Component<Props> {
  values: Animated.Value<0>[];

  state = {
    selected: null,
  };

  constructor(props: Props) {
    super(props);
    const { data } = props;
    this.values = data.map(() => new Animated.Value(0));
  }
  unselect = () => {
    this.setState({ selected: null });
  };
  render() {
    const { data, id, addButton } = this.props;
    const { selected } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView contentContainerStyle={{ flex: 1 }}>
          {data.map((item, index) => (
            <ExcItem
              onPress={() => {
                this.setState({ selected: item.id });
              }}
              {...{ translateY: this.values[index], index }}
              value={item.value}
              title={item.name}
              type={item.type}
              listLength={data.length}
              values={this.values}
              key={item.id}
              id={item.id}
            />
          ))}
          {addButton &&
            addButton({
              addValue: () => {
                this.values.push(new Animated.Value(0));
              },
            })}
        </Animated.ScrollView>

        <Edit
          setOpened={this.unselect}
          title="Edit exercise: "
          opened={selected !== null}
          exercise_id={selected}
          {...{ workout_id: id }}
        />
      </View>
    );
  }
}

export default DraggableList;

const styles = StyleSheet.create({});
