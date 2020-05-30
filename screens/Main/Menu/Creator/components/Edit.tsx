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
import { exerciseType, exercise } from '_types';
import { editExercise } from '_actions/creators/workout';
import { connect } from 'react-redux';
import { RootState } from '_rootReducer';
import _ from 'lodash';
import { fromTimer, timerToString } from '_helpers';
import uid from 'uid';
import ValueSelector from '_components/ValueSelector';

interface Props {
  setOpened: (opened: boolean) => void;
  opened: boolean;
  workout_id: string;
  exercise_id?: string;
  editExercise: typeof editExercise;
  exercise: exercise;
  add: boolean;
  title: string;
  onConfirm: (exc: exercise) => void;
}

const Edit = ({
  opened,
  setOpened,
  workout_id,
  exercise_id,
  onConfirm,
  add,
  exercise,
  title,
  ...props
}: Props) => {
  const { type, name, value } = exercise
    ? exercise
    : { type: null, name: null, value: null };
  const [openedTimeSelector, setOpenedTimeSelector] = useState(false);
  const [localType, setLocalType] = useState('reps');
  const [localName, setLocalName] = useState(
    add ? 'Enter name' : name,
  );
  const [localValue, setLocalValue] = useState(0);
  const excType = add ? localType : type;
  const excValue = add ? localValue : value;
  const toRender = exercise_id || add;

  return (
    <Overlay
      {...{ opened, close: () => setOpened(false) }}
      absoluteComponent={() => {
        if (excType === 'time' && toRender) {
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
        } else if (toRender) {
          return (
            <ValueSelector
              opened={openedTimeSelector}
              setOpened={setOpenedTimeSelector}
              title="Reps: "
              onConfirm={(value) => {
                if (add) {
                  setLocalValue(value);
                } else {
                  props.editExercise(workout_id, exercise_id, {
                    value,
                  });
                }
              }}
            />
          );
        }
      }}
    >
      {toRender && (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
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
                onChange={() => {
                  if (!add) {
                    props.editExercise(workout_id, exercise_id, {
                      name: localName,
                    });
                  }
                }}
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
                  const newType =
                    newValue === 'Reps' ? 'reps' : 'time';
                  if (add) {
                    setLocalType(newType);
                  } else {
                    props.editExercise(workout_id, exercise_id, {
                      type: newType,
                    });
                  }
                }}
                initValue={excType !== 'reps'}
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
          {add ? (
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
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                setOpened(false);
              }}
            >
              <Text style={styles.endEditText}>OK</Text>
            </TouchableWithoutFeedback>
          )}
        </View>
      )}
    </Overlay>
  );
};

const mapStateToProps = (state: RootState, ownProps: Props) => {
  const { add, workout_id, exercise_id } = ownProps;
  if (!add && exercise_id) {
    const { exercises } = state.workouts[
      _.findIndex(
        state.workouts,
        ({ id: currentId }) => currentId === workout_id,
      )
    ];

    const exercise =
      exercises[_.findIndex(exercises, { id: exercise_id })];

    return {
      exercise,
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
  endEditText: {
    fontSize: 25,
    color: palette.text.primary,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
