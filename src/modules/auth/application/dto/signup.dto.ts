import { z } from 'zod'

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export const signUpBodySchema = z.object({
  email: z.string().email(),
  password: z.string().regex(PASSWORD_REGEX, {
    message:
      'Password must have at least 8 characters, 1 uppercase letter, 1 number, and 1 special character',
  }),
  confirmPassword: z.string(),
  name: z.string().min(1).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Confirm password must match password',
  path: ['confirmPassword'],
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
