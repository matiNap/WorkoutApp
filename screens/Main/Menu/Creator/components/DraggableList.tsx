import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import ExcItem from './ExcItem';
import { exercise } from '_types';
import Edit from './Edit';
import Overlay from '_components/Overlay';
import reactotron from 'reactotronConfig';
import { position } from '_types';
import metrics from '_metrics';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  data: exercise[];
  id: string;
  swtitchExpanded: () => void;
  headerTranslateY: Animated.Value<number>;
}

interface State {
  selectedId: string | null;
  selectedIndex: number | null;
}

class DraggableList extends React.Component<Props, State> {
  values: Animated.Value<0>[];
  positions: position[];

  state: State = {
    selectedId: null,
    selectedIndex: null,
  };

  constructor(props: Props) {
    super(props);
    const { data } = props;
    this.values = data.map(() => new Animated.Value(0));
    this.positions = data.map(() => ({ x: 0, y: 0 }));
  }

  setPosition = (position: { x: number; y: number }, index: number) => {
    this.positions = this.positions.map((item, i) => {
      if (i === index) {
        return position;
      }
      return item;
    });
  };

  closeEdit = () => {
    this.setState({ selectedId: null });
  };

  getCurrentPosition = () => {
    const { selectedIndex: index } = this.state;

    if (index) {
      return this.positions[index] ? this.positions[index] : { x: 0, y: 0 };
    }

    return { x: 0, y: 0 };
  };

  render() {
    const { data, id, headerTranslateY } = this.props;
    const { selectedId } = this.state;
    const editOpened = selectedId ? true : false;
    const currentPosition = this.getCurrentPosition();

    return (
      <View style={{ flex: 1 }}>
        <Animated.View style={{ transform: [{ translateY: headerTranslateY }], flex: 1 }}>
          <ScrollView
            onScroll={() => {
              reactotron.log('scrol');
            }}
            contentContainerStyle={styles.listContainer}
          >
            {data.map((item, index) => (
              <ExcItem
                swtichExpanded={this.props.swtitchExpanded}
                onPress={() => {
                  this.setState({
                    selectedId: item.id,
                    selectedIndex: index,
                  });
                }}
                {...{ translateY: this.values[index], index }}
                value={item.value}
                title={item.name}
                type={item.type}
                listLength={data.length}
                values={this.values}
                key={item.id}
                id={item.id}
                workout_id={id}
                setPosition={this.setPosition}
              />
            ))}
          </ScrollView>
        </Animated.View>
        <Edit
          opened={editOpened}
          close={this.closeEdit}
          currentPosition={currentPosition}
          exerciseId={selectedId}
          workoutId={id}
        />
      </View>
    );
  }
}

export default DraggableList;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});
