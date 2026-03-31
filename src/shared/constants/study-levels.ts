export const STUDY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
} as const

export const STUDY_LEVEL_VALUES = [
  STUDY_LEVELS.BEGINNER,
  STUDY_LEVELS.INTERMEDIATE,
] as const

export type StudyLevel =
  (typeof STUDY_LEVEL_VALUES)[number]
