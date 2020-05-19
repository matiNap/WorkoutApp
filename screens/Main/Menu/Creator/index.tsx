import React, { useState } from 'react';
import { StyleSheet, Text, View, BackHandler } from 'react-native';
import palette from '_palette';
import {
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
} from 'react-native-gesture-handler';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import ExcItem from './components/ExcItem';
import AddButton from './components/AddButton';
import Header from '_components/Header';
import { useNavigation } from '@react-navigation/native';
import Settings from './Settings';
import typography from '_typography';
import Back from '_components/Back';
import DraggableList from '_components/DraggableList';

interface Props {
  navigation: any;
}

const DATA = [
  {
    id: '1',
    title: 'Push up',
    value: '20',
    type: 'reps',
  },
  {
    id: '2',
    title: 'Push up',
    value: '20',
    type: 'reps',
  },
  {
    id: '3',
    title: 'Push up',
    value: '20',
    type: 'reps',
  },
];

const List = ({}: Props) => {
  const [name, setName] = useState('Workout name');
  const [settingsOpened, setSettingsOpened] = useState(false);
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

      <DraggableList
        data={DATA}
        renderItem={({ data, translateY, index }) => (
          <ExcItem
            {...{ translateY, index }}
            value={data.value}
            title={data.title}
            type={data.type}
            listLength={DATA.length}
          />
        )}
      />
      <AddButton />
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
