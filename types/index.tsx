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
  workout_id: number;
  id: string;
  loop: number;
  time: number;
}

export type breakType = 'break' | 'typeBreak';

export type breakTodo = { type: breakType; value: number };

export type todo = exercise | breakTodo;
