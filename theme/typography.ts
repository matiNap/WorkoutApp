import { PixelRatio } from 'react-native';

const scaleFont = (size) => size * PixelRatio.getFontScale();

export default {
  fonts: {
    primary: 'rubik',
  },
  fontWeight: {
    bold: 'bold',
    regular: '400',
  },
  fontSize: {
    small: scaleFont(15),
    normal: scaleFont(19),
    medium: scaleFont(20),
    big: scaleFont(22),
    header: scaleFont(24),
  },
};
