import { z } from 'zod'
import { authTokensResponseSchema } from './login.dto'

export const refreshTokenBodySchema = z.object({}).optional()

export const refreshTokenResponseSchema = authTokensResponseSchema

export type RefreshTokenDTO = z.infer<typeof refreshTokenBodySchema>
