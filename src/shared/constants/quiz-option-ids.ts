export const QUIZ_OPTION_IDS = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
} as const

export const QUIZ_OPTION_ID_VALUES = [
  QUIZ_OPTION_IDS.A,
  QUIZ_OPTION_IDS.B,
  QUIZ_OPTION_IDS.C,
  QUIZ_OPTION_IDS.D,
] as const

export type QuizOptionId =
  (typeof QUIZ_OPTION_ID_VALUES)[number]
