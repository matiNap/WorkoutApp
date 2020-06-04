import React from 'react';
import Animated, { interpolate, multiply } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import metrics from '_metrics';
import palette from '_palette';

const size = metrics.width - 30;
const strokeWidth = 18;
const AnimatedPath = Animated.createAnimatedComponent(Path);
const { PI, cos, sin } = Math;
const r = (size - strokeWidth) / 2;
const cx = size / 2;
const cy = size / 2;
const A = PI + PI * 0.4;
const startAngle = PI + PI * 0.2;
const endAngle = 2 * PI - PI * 0.2;
const x1 = cx - r * cos(startAngle);
const y1 = -r * sin(startAngle) + cy;
const x2 = cx - r * cos(endAngle);
const y2 = -r * sin(endAngle) + cy;
const d = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`;

interface Props {
  progress: Animated.Value<number>;
}

const ArcProgress = ({ progress }: Props) => {
  const circumference = r * A;
  const a = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, A],
  });
  const strokeDashoffset = multiply(a, r);
  return (
    <Svg width={size} height={size}>
      <Path
        stroke="rgba(0,0,0,0.5)"
        fill="none"
        strokeDasharray={`${circumference}, ${circumference}`}
        {...{ d, strokeWidth }}
      />
      <AnimatedPath
        stroke={palette.primary}
        fill="none"
        strokeDasharray={`${circumference}, ${circumference}`}
        {...{ d, strokeDashoffset, strokeWidth }}
      />
    </Svg>
  );
};

export default ArcProgress;
