// Shared types for the CourseEditor and its sub-components

export interface CourseQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: boolean;
  acceptedAnswers?: string[];
  explanation: string;
  hint?: string;
  diagram?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  questions: CourseQuestion[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  lessons: Lesson[];
}

export type View = 'units' | 'lessons' | 'questions';
