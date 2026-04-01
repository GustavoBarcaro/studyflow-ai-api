import { z } from 'zod'
import {
  QUIZ_DIFFICULTIES,
  QUIZ_DIFFICULTY_VALUES,
} from '../../../../shared/constants/quiz-difficulties'
import { QUIZ_OPTION_ID_VALUES } from '../../../../shared/constants/quiz-option-ids'

export const generateQuizParamsSchema = z.object({
  id: z.string().uuid(),
})

export const generateLearningPathStepQuizParamsSchema = z.object({
  id: z.string().uuid(),
})

export const generateQuizBodySchema = z.object({
  questions: z.number().min(1).max(10).default(3),
  difficulty: z
    .enum(QUIZ_DIFFICULTY_VALUES)
    .default(QUIZ_DIFFICULTIES.EASY),
})

export const quizOptionSchema = z.object({
  id: z.enum(QUIZ_OPTION_ID_VALUES),
  text: z.string(),
})

export const quizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(quizOptionSchema).length(4),
  correctOptionId: z.enum(QUIZ_OPTION_ID_VALUES),
  explanation: z.string(),
})

export const generateQuizResponseSchema = z.object({
  quiz: z.array(quizQuestionSchema),
})

export const generateLearningPathStepQuizResponseSchema =
  generateQuizResponseSchema.extend({
    learningPathStep: z.object({
      id: z.string().uuid(),
      learningPathId: z.string().uuid(),
      title: z.string(),
      description: z.string(),
      order: z.number().int().positive(),
    }),
    learningPath: z.object({
      id: z.string().uuid(),
      topicId: z.string().uuid(),
      title: z.string(),
      description: z.string(),
      status: z.string(),
    }),
  })

export type GenerateQuizParamsDTO = z.infer<typeof generateQuizParamsSchema>
export type GenerateLearningPathStepQuizParamsDTO = z.infer<
  typeof generateLearningPathStepQuizParamsSchema
>
export type GenerateQuizBodyDTO = z.infer<typeof generateQuizBodySchema>
