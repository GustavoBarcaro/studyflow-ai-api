import { FastifyReply, FastifyRequest } from 'fastify'
import { RefreshTokenDTO } from '../../application/dto/refresh-token.dto'
import { generateAuthTokens } from '../../../../infra/auth/tokens'
import { AuthSessionsRepository } from '../../repositories/auth-sessions-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { hashRefreshToken } from '../../../../infra/auth/refresh-token-hash'

type JWTPayload = {
  sub: string
  email: string
  tokenType: 'access' | 'refresh'
  sid?: string
}

export async function refreshTokenController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { refreshToken } = request.body as RefreshTokenDTO

  try {
    const payload = await request.server.jwt.verify<JWTPayload>(refreshToken)

    if (payload.tokenType !== 'refresh' || !payload.sid) {
      throw new Error('Invalid token type')
    }

    const authSessionsRepository = new AuthSessionsRepository()
    const session = await authSessionsRepository.findById(payload.sid)

    if (!session || session.userId !== payload.sub) {
      throw new Error('Session not found')
    }

    if (session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
      throw new Error('Session revoked or expired')
    }

    if (!session.refreshTokenHash) {
      throw new Error('Missing refresh token hash')
    }

    const refreshTokenHash = hashRefreshToken(refreshToken)

    if (session.refreshTokenHash !== refreshTokenHash) {
      await authSessionsRepository.revoke(session.id)
      throw new Error('Refresh token reuse detected')
    }

    const usersRepository = new UsersRepository()
    const user = await usersRepository.findById(payload.sub)

    if (!user) {
      throw new Error('User not found')
    }

    const tokens = await generateAuthTokens(
      reply,
      {
        id: user.id,
        email: user.email,
      },
      session.id
    )

    await authSessionsRepository.updateTokenData(session.id, {
      refreshTokenHash: hashRefreshToken(tokens.refreshToken),
      expiresAt: tokens.refreshTokenExpiresAt,
    })

    return reply.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  } catch {
    return reply.status(401).send({
      message: 'Invalid refresh token',
    })
  }
}
