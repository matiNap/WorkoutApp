import { workoutType, exercise, todo } from '_types';

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

export const createExerciseTodoList = (
  workoutType: workoutType,
  exericses: exercise[],
  loop: number,
  exericseBreak: number,
  typeBreak: number,
) => {
  let todo: todo[] = [];
  if (workoutType === 'intervals') {
    for (let i = 0; i < loop; i++) {
      for (let j = 0; j < exericses.length; j++) {
        todo.push(exericses[j]);
        if (j !== exericses.length - 1) todo.push({ type: 'break', value: exericseBreak });
      }
      if (i !== loop - 1) todo.push({ type: 'typeBreak', value: typeBreak });
    }
  } else {
    exericses.forEach((exercise, index) => {
      for (let i = 0; i < loop; i++) {
        todo.push(exercise);
        if (i !== loop - 1) todo.push({ type: 'break', value: exericseBreak });
      }
      if (index !== exericses.length - 1) todo.push({ type: 'typeBreak', value: typeBreak });
    });
  }

  return todo;
};

export const createRange = (min: number, max: number) => {
  let values = [];
  for (let i = min; i < max; i++) values.push(i <= 9 ? `0${i}` : i);

  return values;
};
