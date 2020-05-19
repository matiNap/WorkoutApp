import { CSSProperties } from 'react';
import palette from '_palette';

const stylesheet: {
  icon: CSSProperties;
  row: CSSProperties;
} = {
  icon: {
    fontSize: 30,
    color: palette.text.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default stylesheet;
