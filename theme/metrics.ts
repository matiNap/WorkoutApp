import { Dimensions } from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
export default {
  width,
  height,
  headerHeight: 80,
  addButtonHeight: 50,
  excItemHeight: height * 0.25,
};
