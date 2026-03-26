import { z } from 'zod'

export const createTopicSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
  userId: z.string()
})