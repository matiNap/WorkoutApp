import React, { useState } from 'react';
import { Text } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTransition } from 'react-native-redash';
import metrics from '_metrics';
import TimeSelector from '_components/TimeSelector';
import palette from '_palette';
import Header from '_components/Header';
import typography from '_typography';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import stylesheet from '_stylesheet';
import Back from '_components/Back';
import Switch from '_components/Switch';

interface Props {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

const SERIES_TYPE = 'Series';
const ROWS_TYPE = 'Rows';

const Settings = ({ opened, setOpened }: Props) => {
  // BackHandler.addEventListener('hardwareBackPress', () => {
  //   if (opened) {
  //     setOpened(false);
  //     return true;
  //   }
  // });
  const navigation = useNavigation();
  const transitionValue = useTransition(opened, {
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  });

  const translateY = interpolate(transitionValue, {
    inputRange: [0, 1],
    outputRange: [metrics.height, 0],
  });

  const typeBreak = '1:00';
  const excBreak = '0:15';

  const [openedExcTimer, setOpenedExcTimer] = useState(false);
  const [openedTypeTimer, setOpenedTypeTimer] = useState(false);
  const [type, setType] = useState('Series');
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          translateY,
        },
      ]}
    >
      <View style={styles.container}>
        <Header>
          <View style={stylesheet.row}>
            <Back
              onPress={() => {
                setOpened(false);
              }}
            />
            <Text style={styles.title}>Settings</Text>
          </View>
        </Header>
        <View style={styles.settingsContainer}>
          <View style={styles.setting}>
            <Text>Workout type</Text>
            <Switch
              left={SERIES_TYPE}
              right={ROWS_TYPE}
              setValue={setType}
              initValue={ROWS_TYPE}
            />
          </View>
          <View style={styles.setting}>
            <Text>Excerciese break</Text>
            <TouchableWithoutFeedback>
              <Text
                style={styles.time}
                onPress={() => {
                  setOpenedExcTimer(true);
                }}
              >
                {excBreak}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.setting}>
            <Text>{`${type} break`}</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                setOpenedTypeTimer(true);
              }}
            >
              <Text style={styles.time}>{typeBreak}</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {openedExcTimer ? (
          <TimeSelector
            title={'Excercise break:'}
            onConfirm={(minutes, seconds) => {}}
            setOpened={setOpenedExcTimer}
            opened={openedExcTimer}
          />
        ) : null}
        {openedTypeTimer ? (
          <TimeSelector
            title={`${type} break:`}
            setOpened={setOpenedTypeTimer}
            onConfirm={(minutes, seconds) => {}}
            opened={openedTypeTimer}
          />
        ) : null}
      </View>
    </Animated.View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.secondary,
  },
  settingsContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  title: {
    fontSize: typography.fontSize.header,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  setting: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  time: {
    color: palette.grayscale.light,
  },
});
