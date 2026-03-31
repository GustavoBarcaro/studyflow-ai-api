import { z } from 'zod'

export const logoutBodySchema = z.object({
  refreshToken: z.string().min(1),
})

export const logoutResponseSchema = z.object({
  message: z.string(),
})

export type LogoutDTO = z.infer<typeof logoutBodySchema>
