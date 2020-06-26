import { Dimensions } from 'react-native';
import { Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

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
  statusBarHeight: STATUSBAR_HEIGHT,
};
