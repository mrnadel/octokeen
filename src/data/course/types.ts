export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank';

export interface CourseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: boolean;
  acceptedAnswers?: string[];
  explanation: string;
  hint?: string;
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

export interface LessonProgress {
  stars: number;       // 1-3 based on accuracy
  bestAccuracy: number;
  attempts: number;
  lastAttempted: string;
}

export interface CourseProgress {
  displayName: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  completedLessons: Record<string, LessonProgress>;
}

export interface ActiveLesson {
  unitIndex: number;
  lessonIndex: number;
  currentQuestionIndex: number;
  answers: { questionId: string; correct: boolean }[];
  startTime: number;
}

export interface LessonResult {
  lessonId: string;
  unitTitle: string;
  lessonTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  accuracy: number;
  stars: number;
  isNewBest: boolean;
  isFirstCompletion: boolean;
}
