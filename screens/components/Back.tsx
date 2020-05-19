import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import stylesheet from '_stylesheet';

interface Props {
  onPress: () => void;
}

const Back = ({ onPress }: Props) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <AntDesign name="arrowleft" style={stylesheet.icon} />
    </TouchableWithoutFeedback>
  );
};

export default Back;
