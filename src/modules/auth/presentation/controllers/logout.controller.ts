import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthSessionsRepository } from '../../repositories/auth-sessions-repository'
import {
  clearRefreshTokenCookie,
  getRefreshTokenCookieName,
} from '../../../../infra/auth/refresh-token-cookie'

type JWTPayload = {
  sub: string
  tokenType: 'access' | 'refresh'
  sid?: string
}

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const refreshToken = request.cookies[getRefreshTokenCookieName()]

  try {
    if (!refreshToken) {
      throw new Error('Missing refresh token')
    }

    const payload = await request.server.jwt.verify<JWTPayload>(refreshToken)

    if (payload.tokenType !== 'refresh' || !payload.sid) {
      throw new Error('Invalid token type')
    }

    const authSessionsRepository = new AuthSessionsRepository()
    const session = await authSessionsRepository.findById(payload.sid)

    if (!session || session.userId !== payload.sub) {
      throw new Error('Session not found')
    }

    await authSessionsRepository.revoke(session.id)
    clearRefreshTokenCookie(reply)

    return reply.status(200).send({
      message: 'Logged out successfully',
    })
  } catch {
    clearRefreshTokenCookie(reply)

    return reply.status(401).send({
      message: 'Invalid refresh token',
    })
  }
}
