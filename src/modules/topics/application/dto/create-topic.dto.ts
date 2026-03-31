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

export const topicParamsSchema = z.object({
  id: z.string().uuid(),
})

export const topicResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string().nullable().optional(),
})

export const createTopicResponseSchema = topicResponseSchema

export const getTopicsResponseSchema = z.array(topicResponseSchema)

export const updateTopicBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    color: z.string().optional(),
  })
  .refine((data) => data.name !== undefined || data.color !== undefined, {
    message: 'At least one field must be provided',
  })

export const updateTopicDataSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string().min(1).optional(),
  color: z.string().optional(),
})

export const deleteTopicDataSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
})

export type CreateTopicBodyDTO = z.infer<typeof createTopicBodySchema>
export type CreateTopicDataDTO = z.infer<typeof createTopicDataSchema>
export type TopicParamsDTO = z.infer<typeof topicParamsSchema>
export type UpdateTopicBodyDTO = z.infer<typeof updateTopicBodySchema>
export type UpdateTopicDataDTO = z.infer<typeof updateTopicDataSchema>
export type DeleteTopicDataDTO = z.infer<typeof deleteTopicDataSchema>
