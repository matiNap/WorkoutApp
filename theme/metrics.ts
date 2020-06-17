import { Dimensions } from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default {
  width,
  height,
  windowHeight,
  windowWidth,
  headerHeight: windowHeight * 0.12,
  addButtonHeight: 50,
  excItemHeight: height * 0.25,
};
