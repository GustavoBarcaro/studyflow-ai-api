import { z } from 'zod'

export const logoutBodySchema = z.object({}).optional()

export const logoutResponseSchema = z.object({
  message: z.string(),
})

export type LogoutDTO = z.infer<typeof logoutBodySchema>
