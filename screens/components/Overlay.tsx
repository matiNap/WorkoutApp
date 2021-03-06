import React, { ReactNode, CSSProperties, useState, useEffect } from 'react';
import { StyleSheet, BackHandler, View, Keyboard } from 'react-native';
import metrics from '_metrics';
import { useSpringTransition } from 'react-native-redash';
import Animated, { interpolate } from 'react-native-reanimated';
import palette from '_palette';

interface Props {
  width?: number;
  height?: number;
  opened: boolean;
  children: ReactNode;
  style?: CSSProperties;
  close: () => void;
  x?: number;
  y?: number;
}

const WIDTH = metrics.width * 0.8;
const HEIGHT = metrics.height * 0.4;

const { add } = Animated;

const Overlay = ({
  style,
  opened,
  children,
  close,
  x,
  y,
  height: destHeight = HEIGHT,
  width: destWidth = WIDTH,
}: Props) => {
  const [keyboardOpened, seyKeyboardOpened] = useState(false);
  const [backhandler, setBackHandler] = useState(null);
  const keyboardDidShow = () => {
    seyKeyboardOpened(true);
  };
  const keyboardDidHide = () => {
    seyKeyboardOpened(false);
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    setBackHandler(
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (opened) {
          close();
          return true;
        }
      }),
    );
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
      BackHandler.removeEventListener('hardwareBackPress', backhandler);
    };
  }, []);

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const middleY = metrics.height / 2 - height / 2;
  const middleX = metrics.width / 2 - width / 2;

  const transitionValue = useSpringTransition(opened, {});
  const posY = interpolate(transitionValue, {
    inputRange: [0, 1],
    outputRange: [y ? y : middleY, middleY],
  });
  const posX = interpolate(transitionValue, {
    inputRange: [0, 1],
    outputRange: [x ? x : middleX, middleX],
  });
  const opacity = interpolate(transitionValue, {
    inputRange: [0, 0.1, 1],
    outputRange: [0, 1, 1],
  });
  const scale = interpolate(transitionValue, {
    inputRange: [0, 0.05, 1],
    outputRange: [0, 0.6, 1],
  });
  const pointerEvents = opened ? 'auto' : 'none';
  const overlayTransition = useSpringTransition(keyboardOpened, {});
  const overlayTopOffset = interpolate(overlayTransition, {
    inputRange: [0, 1],
    outputRange: [0, -metrics.height / 4],
  });
  return (
    <View
      style={styles.main}
      ref={(ref) => {
        ref?.measure((fx, fy, width, height, px, py) => {
          setLeft(px);
          setTop(py);
        });
      }}
      {...{ pointerEvents }}
    >
      <Animated.View
        style={[
          {
            top: top ? -top : 0,
            left: left ? -left : 0,
            opacity: opacity,
          },
          styles.background,
        ]}
        {...{ pointerEvents }}
      >
        <Animated.View
          style={[
            styles.container,
            {
              width: destWidth,
              height: destHeight,
              opacity: transitionValue,
              transform: [{ scale }],
              ...style,
              top: add(posY, overlayTopOffset),
              left: posX,
            },
          ]}
          onLayout={({ nativeEvent }) => {
            const { width, height } = nativeEvent.layout;
            setWidth(width);
            setHeight(height);
          }}
          {...{ pointerEvents }}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default Overlay;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    position: 'absolute',
    zIndex: 230,
  },
  container: {
    width: WIDTH,
    height: HEIGHT,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: palette.secondary,
    padding: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  background: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 160,
    justifyContent: 'center',
    width: metrics.width,
    height: metrics.height,
  },
});
