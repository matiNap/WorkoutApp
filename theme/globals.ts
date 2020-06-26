import { Platform } from 'react-native';

export default {
  appName: 'AppName',
  isIphone: Platform.OS === 'ios' ? true : false,
};
