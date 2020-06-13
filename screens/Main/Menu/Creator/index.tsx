import React, { useState } from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import palette from '_palette';
import { TouchableWithoutFeedback, TextInput } from 'react-native-gesture-handler';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

import AddButton from './components/AddButton';
import Header from '_components/Header';
import { useNavigation } from '@react-navigation/native';
import typography from '_typography';
import Back from '_components/Back';

import DraggableList from './components/DraggableList';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import { workout } from '_types';
import { saveNameWorkout, addExercise } from '_actions/creators/workout';
import HideIcon from '_components/HideIcon';

import _ from 'lodash';
import { timerToString } from '_helpers';
import { useTransition, useSpringTransition } from 'react-native-redash';
import { Easing, interpolate } from 'react-native-reanimated';
import metrics from '_metrics';
import Settings from './Settings';

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
  const [editListOpened, setEditListOpened] = useState(false);
  const navigation = useNavigation();

  BackHandler.addEventListener('hardwareBackPress', () => {
    if (settingsOpened) {
      setSettingsOpened(false);
      return true;
    }

    navigation.goBack();
  });
  const editListOpenedTransition = useSpringTransition(editListOpened, {});
  const addButtonOffset = interpolate(editListOpenedTransition, {
    inputRange: [0, 1],
    outputRange: [0, 1.5 * metrics.addButtonHeight],
  });
  return (
    <View style={styles.container}>
      <HideIcon
        onPress={() => {
          console.log('on press');
          setEditListOpened(false);
        }}
        transitionValue={editListOpenedTransition}
      />
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

      <DraggableList
        data={exercises}
        {...{ id, editListOpened }}
        openEditList={(open) => setEditListOpened(open)}
      />

      <AddButton
        style={{ transform: [{ translateY: addButtonOffset }] }}
        onPress={() => {
          props.addExercise(id, { name: 'New exercise', type: 'reps', value: 0 });
        }}
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
  hideIcon: {
    fontSize: 25,
  },
});
