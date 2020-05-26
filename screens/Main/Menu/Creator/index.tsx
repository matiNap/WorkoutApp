import React, { useState } from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import palette from '_palette';
import {
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native-gesture-handler';
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
import {
  saveNameWorkout,
  addExercise,
} from '_actions/creators/workout';
import reactotron from 'reactotron-react-native';

interface Props {
  route: {
    params: {
      workout_id: number;
    };
  };
  saveNameWorkout: typeof saveNameWorkout;
  addExercise: typeof addExercise;
  exercises: exercise[];
}

const Creator = ({
  route: { params },
  exercises,
  ...props
}: Props) => {
  const { workout_id } = params;

  const workout: workout = useSelector(
    (state: RootState) => state.workouts[workout_id - 1],
  );
  const {
    type,
    exerciseBreak,
    typeBreak,
    name: workoutTitle,
  } = workout;
  const [name, setName] = useState(workoutTitle);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [addOpened, setAddOpened] = useState(false);
  const navigation = useNavigation();
  BackHandler.addEventListener('hardwareBackPress', () => {
    console.log(settingsOpened);
    if (settingsOpened) {
      setSettingsOpened(false);
      return true;
    }

    navigation.goBack();
  });
  console.log(exercises);
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
              props.saveNameWorkout(workout_id, name);
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
          {type === 'intervals' && (
            <Text style={styles.time}>22:00</Text>
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              setSettingsOpened(!settingsOpened);
            }}
          >
            <MaterialIcons
              name="settings"
              style={styles.headerIcon}
            />
          </TouchableWithoutFeedback>
        </View>
      </Header>
      <Edit
        opened={addOpened}
        setOpened={setAddOpened}
        title="Add excercise: "
        add
        onConfirm={(exc: exercise) => {
          props.addExercise(workout_id, exc);
        }}
      />
      <DraggableList data={exercises} {...{ workout_id }} />
      <AddButton
        onPress={() => {
          setAddOpened(true);
        }}
      />

      <Settings
        opened={settingsOpened}
        setOpened={setSettingsOpened}
        {...{ workout_id, type, exerciseBreak, typeBreak }}
      />
    </View>
  );
};

const mapStateToProps = (state: RootState, ownProps: Props) => {
  const { workout_id } = ownProps.route.params;
  return {
    exercises: state.workouts[workout_id - 1].exercises,
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
  },
  headerIcon: {
    color: palette.text.primary,
    fontSize: 32,
  },
  textInput: {
    color: palette.text.primary,
    fontSize: typography.fontSize.header,
    marginLeft: 10,
    fontFamily: typography.fonts.primary,
    width: '60%',
  },
  time: {
    fontSize: 19,
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
