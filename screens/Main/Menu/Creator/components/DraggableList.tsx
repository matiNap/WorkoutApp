import React from 'react';
import { View } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import ExcItem from './ExcItem';
import { exercise } from '_types';
import Edit from './Edit';
import { position } from '_types';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import EditValue from './EditValue';
import { withTimingTransition } from 'react-native-redash';

interface Props {
  data: exercise[];
  id: string;
  openEditList: (open: boolean) => void;
  editListOpened: boolean;
}

interface State {
  selectedId: string | null;
  selectedValueId: string | null;
  selectedIndex: number | null;
}

class DraggableList extends React.Component<Props, State> {
  values: Animated.Value<0>[];
  positions: position[];

  state: State = {
    selectedId: null,
    selectedIndex: null,
    selectedValueId: null,
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

  closeEditValue = () => {
    this.setState({ selectedValueId: null });
  };

  getCurrentNamePosition = () => {
    const { selectedIndex: index } = this.state;

    if (index !== null) {
      return this.positions[index] ? this.positions[index] : { x: 0, y: 0 };
    }

    return { x: 0, y: 0 };
  };

  openEditList = () => {
    this.props.openEditList(true);
  };

  render() {
    const { data, id: workout_id, editListOpened } = this.props;
    const { selectedId, selectedValueId } = this.state;
    const editOpened = selectedId ? true : false;
    const currentPosition = this.getCurrentNamePosition();

    const editValueOpened = selectedValueId ? true : false;
    const editListTransitionValue = withTimingTransition(editListOpened, {
      duration: 150,
      easing: Easing.inOut(Easing.exp),
    });

    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item, index) => {
            const { value, type, name, id } = item;
            return (
              <TouchableWithoutFeedback key={id} onLongPress={this.openEditList}>
                <ExcItem
                  {...{
                    translateY: this.values[index],
                    index,
                    editListOpened,
                    id,
                    title: name,
                    type,
                    value,
                    workout_id,
                  }}
                  onPressName={() => {
                    this.setState({
                      selectedId: item.id,
                      selectedIndex: index,
                    });
                  }}
                  onPressValue={() => {
                    this.setState({
                      selectedValueId: item.id,
                    });
                  }}
                  listLength={data.length}
                  values={this.values}
                  setPosition={this.setPosition}
                />
              </TouchableWithoutFeedback>
            );
          })}
        </ScrollView>
        <EditValue
          opened={editValueOpened}
          close={this.closeEditValue}
          workoutId={workout_id}
          exerciseId={selectedValueId}
        />
        <Edit
          opened={editOpened}
          close={this.closeEdit}
          currentPosition={currentPosition}
          exerciseId={selectedId}
          workoutId={workout_id}
        />
      </View>
    );
  }
}

export default DraggableList;
