import React from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { Text } from 'react-native-elements';
import Overlay from '_components/Overlay';
import ExitButtons from '_components/ExitButtons';
import { TextInput } from 'react-native-gesture-handler';
import typography from '_typography';
import palette from '_palette';
import { position, exercise } from '_types';
import { editExercise } from '_actions/creators/workout';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import _ from 'lodash';
import metrics from '_metrics';

interface Props {
  opened: boolean;
  close: () => void;
  currentPosition: position;
  exerciseId: string;
  name: string;
  workoutId: string;
  editExercise: typeof editExercise;
  updateLocalExercise: (index: number | string, update: exercise) => void;
}

class Edit extends React.Component<Props> {
  state = {
    inputValue: '',
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.exerciseId !== prevProps.exerciseId && this.props.exerciseId !== null) {
      this.setState({ inputValue: this.props.name });
    }
  }

  onConfirm = () => {
    const { workoutId, exerciseId } = this.props;
    const { inputValue } = this.state;
    const updated = { name: inputValue };
    this.props.editExercise(workoutId, exerciseId, updated);
    this.props.updateLocalExercise(exerciseId, updated);
  };

  render() {
    const { opened, currentPosition: pos } = this.props;
    const { inputValue } = this.state;
    const currentPosition = pos ? pos : { x: 0, y: 0 };

    return (
      <Overlay
        width={metrics.width * 0.7}
        height={metrics.height * 0.22}
        opened={opened}
        close={this.props.close}
        x={currentPosition.x}
        y={currentPosition.y}
      >
        <Text style={styles.editTitle}>Exercise name:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputValue}
            onChangeText={(text) => this.setState({ inputValue: text })}
          />
        </View>
        <ExitButtons
          setOpened={this.props.close}
          onConfirm={() => {
            this.onConfirm();
            Keyboard.dismiss();
          }}
          onCancel={() => {
            Keyboard.dismiss();
            this.props.close();
          }}
        />
      </Overlay>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: Props) => {
  const { exerciseId, workoutId } = ownProps;

  if (exerciseId) {
    const { exercises } = state.workouts[
      _.findIndex(state.workouts, ({ id: currentId }) => currentId === workoutId)
    ];

    const exercise: exercise = exercises[_.findIndex(exercises, { id: exerciseId })];

    return {
      name: exercise.name,
    };
  } else return {};
};

export default connect(mapStateToProps, {
  editExercise,
})(Edit);

const styles = StyleSheet.create({
  textInput: {
    fontSize: typography.fontSize.normal,
    color: palette.text.primary,
    flex: 1,
    fontFamily: typography.fonts.primary,
    alignSelf: 'center',

    width: '100%',

    paddingHorizontal: 5,
    height: 20,
  },

  editTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 10,
  },
});
