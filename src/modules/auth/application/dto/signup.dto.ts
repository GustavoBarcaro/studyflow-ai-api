import { z } from 'zod'

export const createUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
})

export type CreateUserBodyDTO = z.infer<typeof createUserBodySchema>