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

export const toHoursTimer = (
  time: number,
): {
  minutes: number;
  seconds: number;
  hours: number;
} => {
  return {
    ...toTimer(time),
    hours: Math.floor(time / 3600),
  };
};

const timeWithZero = (num: number) => {
  if (num < 10) {
    return `0${num}`;
  }

  return num;
};

export const timerToString = (time: number) => {
  const { minutes, seconds, hours } = toHoursTimer(time);

  if (hours && hours >= 1) {
    return `${timeWithZero(hours)}:${timeWithZero(minutes)}:${timeWithZero(seconds)}`;
  } else {
    return `${timeWithZero(minutes)}:${timeWithZero(seconds)}`;
  }
};

export const hourTimerToString = (time: number) => {
  const { minutes, seconds, hours } = toHoursTimer(time);

  return `${timeWithZero(hours)}:${timeWithZero(minutes)}:${timeWithZero(seconds)}`;
};
