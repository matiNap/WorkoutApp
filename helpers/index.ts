export const fromTimer = (minutes: number, seconds: number) => {
  return minutes * 60 + seconds;
};

export const toTimer = (
  time: number,
): {
  minutes: number;
  seconds: number;
} => {
  return {
    minutes: Math.floor(time / 60),
    seconds: time % 60,
  };
};

const timeWithZero = (num: number) => {
  if (num < 10) {
    return `0${num}`;
  }

  return num;
};

export const timerToString = (time: number) => {
  const { minutes, seconds } = toTimer(time);

  return `${timeWithZero(minutes)}:${timeWithZero(seconds)}`;
};
