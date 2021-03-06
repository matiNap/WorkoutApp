import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import ExcItem from './ExcItem';
import { exercise } from '_types';
import Edit from './Edit';
import { position } from '_types';
import EditValue from './EditValue';
import metrics from '_metrics';
import AddButton from './AddButton';
import { addExercise } from '_actions/creators/workout';
import { connect } from 'react-redux';
import _ from 'lodash';
import uid from 'uid';
import palette from '_palette';
import { Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  data: exercise[];
  id: string;
  openEditList: (open: boolean) => void;
  editListOpened: boolean;
  editTransition: Animated.Value<number>;
  addButtonOffset: Animated.Value<number>;
  addExercise: typeof addExercise;
}

interface State {
  selectedId: string | null;
  selectedValueId: string | null;
  selectedIndex: number | null;
}

class DraggableList extends React.Component<Props, State> {
  offsets: Animated.Value<number>[];
  positions: position[];
  data: exercise[];

  state: State = {
    selectedId: null,
    selectedIndex: null,
    selectedValueId: null,
  };

  constructor(props: Props) {
    super(props);
    const { data } = props;
    this.offsets = data.map((_, index) => new Animated.Value(index * metrics.excItemHeight));
    this.positions = data.map(() => ({ x: 0, y: 0 }));
    this.data = [...data];
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

  addExercise = () => {
    const { id } = this.props;
    const newExercise = { name: 'New exercise', type: 'reps', value: 1, id: uid() };
    this.props.addExercise(id, newExercise);
    this.offsets.push(new Animated.Value(this.offsets.length * metrics.excItemHeight));
    this.data.push(newExercise);
  };

  removeExercise = (removedIndex: number) => {
    this.offsets = _.remove(this.offsets, (_, index) => {
      return index !== removedIndex;
    });
    this.data = _.remove(this.data, (_, index) => {
      return index !== removedIndex;
    });
    this.offsets = this.props.data.map(
      (_, index) => new Animated.Value(index * metrics.excItemHeight),
    );
  };

  editExercise = (editIndex: number | string, update: exercise) => {
    this.data = this.data.map((currentExercise, index) => {
      if (index === editIndex || currentExercise.id === editIndex) {
        return {
          ...currentExercise,
          ...update,
        };
      }

      return currentExercise;
    });
  };

  render() {
    const { data, id: workout_id, editListOpened, editTransition, addButtonOffset } = this.props;
    const { selectedId, selectedValueId } = this.state;
    const editOpened = selectedId ? true : false;
    const currentPosition = this.getCurrentNamePosition();

    const editValueOpened = selectedValueId ? true : false;
    const listHeight =
      10 + this.offsets.length * metrics.excItemHeight + metrics.addButtonHeight + 20;
    return (
      <View style={{ flex: 1 }}>
        {this.data.length !== 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContainer, { height: listHeight }]}
          >
            {this.data.map((item, index) => {
              const { value, type, name } = item;
              const id = item.id ? item.id : `${index}exc`;
              return (
                <ExcItem
                  key={id}
                  onLongPress={this.openEditList}
                  {...{
                    currentOffset: this.offsets[index],
                    myIndex: index,
                    editListOpened,
                    id,
                    title: name,
                    type,
                    value,
                    workout_id,
                    editTransition,
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
                  offsets={this.offsets}
                  setPosition={this.setPosition}
                  deleteLocalExercise={this.removeExercise}
                  updateLocalExercise={this.editExercise}
                  otherItems={this.data}
                />
              );
            })}
          </ScrollView>
        ) : (
          <Text style={styles.placeholder}>Add exercise</Text>
        )}
        <EditValue
          opened={editValueOpened}
          close={this.closeEditValue}
          workoutId={workout_id}
          exerciseId={selectedValueId}
          updateLocalExercise={this.editExercise}
        />
        <Edit
          opened={editOpened}
          close={this.closeEdit}
          currentPosition={currentPosition}
          exerciseId={selectedId}
          workoutId={workout_id}
          updateLocalExercise={this.editExercise}
        />
        <AddButton
          style={{ transform: [{ translateY: addButtonOffset }] }}
          onPress={this.addExercise}
        />
      </View>
    );
  }
}

export default connect(null, { addExercise })(DraggableList);

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: metrics.addButtonHeight + 20,
  },
  placeholder: {
    color: palette.text.gray,
    position: 'absolute',
    alignSelf: 'center',
    top: metrics.height / 3,
  },
});
