export const QUIZ_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const

export const QUIZ_DIFFICULTY_VALUES = [
  QUIZ_DIFFICULTIES.EASY,
  QUIZ_DIFFICULTIES.MEDIUM,
  QUIZ_DIFFICULTIES.HARD,
] as const

export type QuizDifficulty =
  (typeof QUIZ_DIFFICULTY_VALUES)[number]
