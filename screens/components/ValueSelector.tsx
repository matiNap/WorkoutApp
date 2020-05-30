import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import Overlay from './Overlay';
import ExitButtons from './ExitButtons';
import Roll from './TimeSelector/Roll';
import palette from '_palette';
import typography from '_typography';

interface Props {
  title: string;
  opened: boolean;
  setOpened: (boolean: boolean) => void;
  onConfirm: (value: number) => void;
}
const createRange = () => {
  let values = [];
  for (let i = 0; i < 100; i++) values.push(i);

  return values;
};

const RANGE = createRange();

const ValueSelector = ({
  title,
  opened,
  setOpened,
  onConfirm,
}: Props) => {
  const [value, setValue] = useState(0);
  return (
    <Overlay {...{ opened, close: () => setOpened(false) }}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rollContainer}>
          <Roll setIndex={setValue} range={RANGE} />
        </View>
        <ExitButtons
          {...{ setOpened }}
          onConfirm={() => {
            onConfirm(value);
          }}
        />
      </View>
    </Overlay>
  );
};

export default ValueSelector;

const styles = StyleSheet.create({
  title: {
    color: palette.text.primary,
    fontSize: typography.fontSize.big,
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
  rollContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});
