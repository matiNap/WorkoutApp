import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import TimeSelector from '_components/TimeSelector';
import Overlay from '_components/Overlay';
import ExitButtons from '_components/ExitButtons';
import Switch from '_components/Switch';
import {
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native-gesture-handler';
import typography from '_typography';
import palette from '_palette';
import stylesheet from '_stylesheet';
import { workoutType, exerciseType, exercise } from '_types';
import { editExercise } from '_actions/creators/workout';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import reactotron from 'reactotronConfig';
import { fromTimer, timerToString } from '_helpers';
import uid from 'uid';

interface Props {
  setOpened: (opened: boolean) => void;
  title: string;
  opened: boolean;
  type: exerciseType;
  workout_id: number;
  exercise_id?: string;
  editExercise: typeof editExercise;
  value: number;
  name: string;
  add: boolean;
  onConfirm: (exc: exercise) => void;
}

const Edit = ({
  opened,
  setOpened,
  title,
  type,
  name,
  value,
  workout_id,
  exercise_id,
  onConfirm,
  add,
  ...props
}: Props) => {
  const [openedTimeSelector, setOpenedTimeSelector] = useState(false);
  const [localType, setLocalType] = useState('reps');
  const [localName, setLocalName] = useState('Push up');
  const [localValue, setLocalValue] = useState(0);
  const excType = add ? localType : type;
  const excValue = add ? localValue : value;

  return (
    <Overlay
      {...{ opened }}
      absoluteComponent={() => {
        if (excType === 'time') {
          return (
            <TimeSelector
              opened={openedTimeSelector}
              setOpened={setOpenedTimeSelector}
              title="Time: "
              onConfirm={(minutes, time) => {
                const v = fromTimer(minutes, time);
                if (add) {
                  setLocalValue(v);
                } else {
                  props.editExercise(workout_id, exercise_id, {
                    value: v,
                  });
                }
              }}
            />
          );
        } else {
          return null;
        }
      }}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.settingsContainer}>
        <View style={styles.setting}>
          <Text>Name:</Text>
          <TextInput
            value={localName}
            onChangeText={(text) => {
              setLocalName(text);
            }}
            placeholder="Enter a name"
            style={styles.textInput}
            placeholderTextColor={palette.text.gray}
            onEndEditing={() => {
              if (!add) {
                props.editExercise(workout_id, exercise_id, {
                  name: localName,
                });
              }
            }}
          />
        </View>
        <View style={styles.setting}>
          <Text>Type:</Text>
          <Switch
            onChange={(newValue) => {
              if (add) {
                setLocalType(newValue === 'Reps' ? 'reps' : 'time');
              } else {
                props.editExercise(workout_id, exercise_id, {
                  type: newValue,
                });
              }
            }}
            initValue={excType === 'reps'}
            left="Reps"
            right="Time"
          />
        </View>
        <View style={styles.setting}>
          <Text>Value: </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              setOpenedTimeSelector(true);
            }}
          >
            <Text style={stylesheet.subText}>
              {excType === 'reps'
                ? excValue
                : timerToString(excValue)}
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <ExitButtons
        {...{ setOpened }}
        onConfirm={() => {
          const exc: exercise = {
            name: localName,
            type: localType,
            value: localValue,
            id: uid(),
          };
          onConfirm(exc);
        }}
      />
    </Overlay>
  );
};

const mapStateToProps = (state: RootState, ownProps: Props) => {
  if (!ownProps.add) {
    const { exercises } = state.workouts[ownProps.workout_id];
    const exc = exercises[ownProps.exercise_id];

    reactotron.log(exc);

    const { type, name, value } = exc;
    return {
      type,
      name,
      value,
    };
  }

  return {};
};

export default connect(mapStateToProps, {
  editExercise,
})(Edit);

const styles = StyleSheet.create({
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  settingsContainer: {
    marginTop: 10,
    height: '40%',
    justifyContent: 'space-between',
  },
  title: {
    alignSelf: 'center',
    fontSize: typography.fontSize.medium,
  },
  textInput: {
    fontSize: typography.fontSize.normal,
    color: palette.text.primary,
    width: '50%',
  },
});
