import { z } from 'zod'
import {
  STUDY_LEVELS,
  STUDY_LEVEL_VALUES,
} from '../../../../shared/constants/study-levels'

export const explainAgainParamsSchema = z.object({
  id: z.string().uuid(),
})

export const explainAgainBodySchema = z.object({
  focus: z.string().optional(),
  level: z.enum(STUDY_LEVEL_VALUES).default(STUDY_LEVELS.BEGINNER),
})

export const explainAgainResponseSchema = z.object({
  explanation: z.string(),
})

export type ExplainAgainParamsDTO = z.infer<typeof explainAgainParamsSchema>
export type ExplainAgainBodyDTO = z.infer<typeof explainAgainBodySchema>
