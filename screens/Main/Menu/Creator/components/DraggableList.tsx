import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ExcItem from './ExcItem';
import { workout, exercise } from '_types';
import Edit from './Edit';

interface Props {
  data: exercise[];
  workout_id: number;
}

class DraggableList extends React.Component<Props> {
  values: Animated.Value<0>[];

  state = {
    editOpened: false,
  };

  constructor(props: Props) {
    super(props);
    const { data } = props;
    this.values = data.map(() => new Animated.Value(0));
  }
  setEditOpend = (opened: boolean) => {
    this.setState({ editOpened: opened });
  };
  render() {
    const { data, workout_id } = this.props;
    const { editOpened } = this.state;
    console.log(editOpened);
    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView contentContainerStyle={{ flex: 1 }}>
          {data.map((item, index) => (
            <ExcItem
              onPress={() => {
                this.setState({ editOpened: item.id });
              }}
              {...{ translateY: this.values[index], index }}
              value={item.value}
              title={item.name}
              type={item.type}
              listLength={data.length}
              values={this.values}
              key={`exc${index}`}
            />
          ))}
        </Animated.ScrollView>
        {editOpened && (
          <Edit
            setOpened={this.setEditOpend}
            title="Edit exercise: "
            opened={editOpened}
            exercise_id={editOpened}
            {...{ workout_id }}
          />
        )}
      </View>
    );
  }
}

export default DraggableList;

const styles = StyleSheet.create({});
