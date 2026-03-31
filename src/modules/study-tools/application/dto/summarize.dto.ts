import { z } from 'zod'

export const summarizeSessionParamsSchema = z.object({
  id: z.string().uuid(),
})

export const summarizeSessionResponseSchema = z.object({
  summary: z.string(),
})

export type SummarizeSessionParamsDTO = z.infer<
  typeof summarizeSessionParamsSchema
>
