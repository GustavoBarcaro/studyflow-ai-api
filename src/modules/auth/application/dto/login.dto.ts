import { z } from 'zod'

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const loginResponseSchema = z.object({
  token: z.string(),
})

export type LoginDTO = z.infer<typeof loginBodySchema>