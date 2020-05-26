export type exerciseType = 'reps' | 'time';

export interface exercise {
  id: string;
  name: string;
  type: exerciseType;
  value: number;
}

export type workoutType = 'series' | 'intervals';

export interface workout {
  name: string;
  exercises: exercise[];
  type: workoutType;
  exerciseBreak: number;
  typeBreak: number;
}
