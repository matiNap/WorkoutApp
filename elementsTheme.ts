import palette from '_palette';
import typography from '_typography';

export default {
  Text: {
    style: {
      fontFamily: 'rubik',
      color: palette.text.primary,
      fontSize: typography.fontSize.normal,
    },
  },
  Overlay: {
    overlayStyle: {
      backgroundColor: palette.secondary,
      borderRadius: 20,
      padding: 15,
    },
  },
};
