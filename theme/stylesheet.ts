import { CSSProperties } from 'react';
import palette from '_palette';
import typography from '_typography';

const stylesheet: {
  icon: CSSProperties;
  row: CSSProperties;
  subText: CSSProperties;
} = {
  icon: {
    fontSize: 30,
    color: palette.text.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subText: {
    fontSize: typography.fontSize.normal,
    color: palette.text.gray,
  },
};

export default stylesheet;
