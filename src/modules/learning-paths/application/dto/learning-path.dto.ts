import { z } from 'zod'
import { LEARNING_PATH_STATUS_VALUES } from '../../../../shared/constants/learning-path-statuses'

export const learningPathStepParamsSchema = z.object({
  id: z.string().uuid(),
})

export const topicLearningPathParamsSchema = z.object({
  id: z.string().uuid(),
})

export const createLearningPathBodySchema = z
  .object({
    goal: z.string().min(1).optional(),
    sessionId: z.string().uuid().optional(),
  })
  .optional()

export const createLearningPathDataSchema = z.object({
  topicId: z.string().uuid(),
  userId: z.string().uuid(),
  goal: z.string().min(1).optional(),
  sessionId: z.string().uuid().optional(),
})

export const updateLearningPathStepDataSchema = z.object({
  stepId: z.string().uuid(),
  userId: z.string().uuid(),
})

export const learningPathStepSchema = z.object({
  id: z.string().uuid(),
  learningPathId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  order: z.number().int().positive(),
  completed: z.boolean(),
  completedAt: z.date().nullable(),
})

export const learningPathSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  topicId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  status: z.enum(LEARNING_PATH_STATUS_VALUES),
})

export const learningPathResponseSchema = learningPathSchema.extend({
  steps: z.array(learningPathStepSchema),
})

export const generatedLearningPathStepSchema = learningPathStepSchema.omit({
  id: true,
  learningPathId: true,
  completed: true,
  completedAt: true,
})

export const generatedLearningPathSchema = learningPathSchema
  .omit({
    id: true,
    userId: true,
    topicId: true,
    createdAt: true,
    status: true,
  })
  .extend({
    steps: z.array(generatedLearningPathStepSchema).min(4).max(6),
  })

export type TopicLearningPathParamsDTO = z.infer<
  typeof topicLearningPathParamsSchema
>
export type LearningPathStepParamsDTO = z.infer<
  typeof learningPathStepParamsSchema
>
export type CreateLearningPathBodyDTO = z.infer<
  typeof createLearningPathBodySchema
>
export type CreateLearningPathDataDTO = z.infer<
  typeof createLearningPathDataSchema
>
export type UpdateLearningPathStepDataDTO = z.infer<
  typeof updateLearningPathStepDataSchema
>
