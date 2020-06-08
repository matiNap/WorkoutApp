import React, { useState } from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import palette from '_palette';
import { TouchableWithoutFeedback, TextInput } from 'react-native-gesture-handler';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

import AddButton from './components/AddButton';
import Header from '_components/Header';
import { useNavigation } from '@react-navigation/native';
import Settings from './Settings';
import typography from '_typography';
import Back from '_components/Back';
import Edit from './components/Edit';
import DraggableList from './components/DraggableList';
import { useSelector, connect } from 'react-redux';
import { RootState } from '_rootReducer';
import { workout, exercise } from '_types';
import { saveNameWorkout, addExercise } from '_actions/creators/workout';

import _ from 'lodash';
import reactotron from 'reactotronConfig';
import { timerToString } from '_helpers';

interface Props {
  route: {
    params: {
      id: number;
      add: boolean;
    };
  };
  saveNameWorkout: typeof saveNameWorkout;
  addExercise: typeof addExercise;
  workout: workout;
}

const Creator = ({ workout, ...props }: Props) => {
  const { type, exerciseBreak, typeBreak, name: workoutTitle, exercises, id, time, loop } = workout;
  const [name, setName] = useState(workoutTitle);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [addOpened, setAddOpened] = useState(false);
  const navigation = useNavigation();
  BackHandler.addEventListener('hardwareBackPress', () => {
    if (settingsOpened) {
      setSettingsOpened(false);
      return true;
    }

    navigation.goBack();
  });

  return (
    <View style={styles.container}>
      <Header>
        <View style={styles.left}>
          <Back
            onPress={() => {
              navigation.goBack();
            }}
          />
          <TextInput
            value={name}
            style={styles.textInput}
            onChangeText={(text) => {
              setName(text);
            }}
            onEndEditing={() => {
              props.saveNameWorkout(id, name);
            }}
          />
          <AntDesign name="edit" style={styles.editIcon} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {type === 'intervals' && time !== -1 && (
            <Text style={styles.time}>{timerToString(time)}</Text>
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              setSettingsOpened(!settingsOpened);
            }}
          >
            <MaterialIcons name="settings" style={styles.headerIcon} />
          </TouchableWithoutFeedback>
        </View>
      </Header>
      <Edit
        opened={addOpened}
        setOpened={setAddOpened}
        title="Add excercise: "
        add
        onConfirm={(exc: exercise) => {
          props.addExercise(id, exc);
        }}
      />
      <DraggableList
        data={exercises}
        {...{ id }}
        addButton={({ addValue }) => (
          <AddButton
            onPress={() => {
              setAddOpened(true);
              addValue();
            }}
          />
        )}
      />

      <Settings
        opened={settingsOpened}
        setOpened={setSettingsOpened}
        {...{ id, type, exerciseBreak, typeBreak, loop }}
      />
    </View>
  );
};

const mapStateToProps = (state: RootState, ownProps: Props) => {
  const { add } = ownProps.route.params;
  const { workouts } = state;
  if (add) {
    const workout = workouts[workouts.length - 1];

    return {
      workout: workout ? workout : { type: null, exercises: [], name: 'Workout name' },
    };
  }

  const { id } = ownProps.route.params;

  return {
    workout: state.workouts[_.findIndex(workouts, ({ id: currentId }) => currentId === id)],
  };
};

export default connect(mapStateToProps, {
  saveNameWorkout,
  addExercise,
})(Creator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.secondary,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  headerIcon: {
    color: palette.text.primary,
    fontSize: 32,
  },
  textInput: {
    color: palette.text.primary,
    fontSize: typography.fontSize.medium,
    marginLeft: 10,
    fontFamily: typography.fonts.primary,
    width: '60%',
  },
  time: {
    fontSize: 16,
    marginRight: 10,
    color: palette.grayscale.light,
  },
  editIcon: {
    fontSize: 25,
    alignSelf: 'center',
    color: palette.grayscale.light,
    marginLeft: 5,
  },
});
