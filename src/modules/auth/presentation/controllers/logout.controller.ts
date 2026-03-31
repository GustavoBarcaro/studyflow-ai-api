import { FastifyReply, FastifyRequest } from 'fastify'
import { LogoutDTO } from '../../application/dto/logout.dto'
import { AuthSessionsRepository } from '../../repositories/auth-sessions-repository'

type JWTPayload = {
  sub: string
  tokenType: 'access' | 'refresh'
  sid?: string
}

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { refreshToken } = request.body as LogoutDTO

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

    await authSessionsRepository.revoke(session.id)

    return reply.status(200).send({
      message: 'Logged out successfully',
    })
  } catch {
    return reply.status(401).send({
      message: 'Invalid refresh token',
    })
  }
}
