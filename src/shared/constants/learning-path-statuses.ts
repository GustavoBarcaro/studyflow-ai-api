export const LEARNING_PATH_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const

export const LEARNING_PATH_STATUS_VALUES = [
  LEARNING_PATH_STATUSES.ACTIVE,
  LEARNING_PATH_STATUSES.COMPLETED,
] as const

export type LearningPathStatus =
  (typeof LEARNING_PATH_STATUS_VALUES)[number]
