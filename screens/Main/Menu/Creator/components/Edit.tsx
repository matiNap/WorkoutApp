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

interface Props {
  setOpened: (opened: boolean) => void;
  title: string;
  opened: boolean;
}

const Edit = ({ opened, setOpened, title }: Props) => {
  const type = 'Series';
  const value = '15:00';
  const [openedTimeSelector, setOpenedTimeSelector] = useState(true);
  return (
    <Overlay
      {...{ opened }}
      absoluteComponent={() => {
        return (
          <TimeSelector
            opened={openedTimeSelector}
            setOpened={setOpenedTimeSelector}
            title="Time: "
            onConfirm={(minutes, time) => {}}
          />
        );
      }}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.settingsContainer}>
        <View style={styles.setting}>
          <Text>Name:</Text>
          <TextInput
            placeholder="Enter a name"
            style={styles.textInput}
            placeholderTextColor={palette.text.gray}
          />
        </View>
        <View style={styles.setting}>
          <Text>Type:</Text>
          <Switch
            onChange={() => {}}
            initValue={type}
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
            <Text style={stylesheet.subText}>{value}</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <ExitButtons {...{ setOpened }} onConfirm={() => {}} />
    </Overlay>
  );
};

export default Edit;

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
