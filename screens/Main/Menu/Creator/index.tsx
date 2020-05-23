import React, { useState } from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import palette from '_palette';
import {
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

import AddButton from './components/AddButton';
import Header from '_components/Header';
import { useNavigation } from '@react-navigation/native';
import Settings from './Settings';
import typography from '_typography';
import Back from '_components/Back';
// import DraggableList from './components/DraggableList';
import Overlay from '_components/Overlay';
import Edit from './components/Edit';
import DraggableList from './components/DraggableList';
import { useSelector, createSelectorHook } from 'react-redux';
import { RootState } from '_rootReducer';

interface Props {
  navigation: any;
}

const List = ({}: Props) => {
  const workoutId = 0;
  const exercises = useSelector((state: RootState) => {
    return state.workouts[workoutId] ? state.workouts[workoutId] : [];
  });
  const [name, setName] = useState('Workout name');
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const navigation = useNavigation();
  BackHandler.addEventListener('hardwareBackPress', () => {
    console.log(settingsOpened);
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
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={styles.time}>22:00</Text>
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
      />
      <DraggableList data={[]} />
      <AddButton
        onPress={() => {
          setAddOpened(true);
        }}
      />

      <Settings
        opened={settingsOpened}
        setOpened={setSettingsOpened}
      />
    </View>
  );
};

export default List;

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
  },
  time: {
    fontSize: 19,
    marginRight: 10,
    color: palette.grayscale.light,
  },
});
