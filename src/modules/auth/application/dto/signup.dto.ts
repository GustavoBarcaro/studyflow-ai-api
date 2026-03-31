import { z } from 'zod'

export const signUpBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
})

export const signUpUserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
})

export const signUpResponseSchema = z.object({
  user: signUpUserResponseSchema,
  accessToken: z.string(),
})

export type SignUpBodyDTO = z.infer<typeof signUpBodySchema>
