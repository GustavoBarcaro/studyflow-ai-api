import { z } from 'zod'

export const createTopicBodySchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
})


export const createTopicDataSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
  userId: z.string(),
})

export const createTopicResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string().nullable().optional(),
})

export type CreateTopicBodyDTO = z.infer<typeof createTopicBodySchema>
export type CreateTopicDataDTO = z.infer<typeof createTopicDataSchema>