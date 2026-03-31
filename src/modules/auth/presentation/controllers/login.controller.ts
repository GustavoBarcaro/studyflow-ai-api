import { FastifyReply, FastifyRequest } from 'fastify'
import { UsersRepository } from '../../repositories/users-repository'
import { BcryptHasher } from '../../../../infra/services/hash-bcrypt'
import { LoginUseCase } from '../../application/use-cases/login.use-case'
import { LoginDTO } from '../../application/dto/login.dto'
import { generateAuthTokens } from '../../../../infra/auth/tokens'
import { AuthSessionsRepository } from '../../repositories/auth-sessions-repository'
import { hashRefreshToken } from '../../../../infra/auth/refresh-token-hash'
import { setRefreshTokenCookie } from '../../../../infra/auth/refresh-token-cookie'

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as LoginDTO
  
  try {
    const usersRepository = new UsersRepository()
    const hasher = new BcryptHasher()
    const loginUseCase = new LoginUseCase(usersRepository, hasher)

    const user = await loginUseCase.execute({ email, password })
    const authSessionsRepository = new AuthSessionsRepository()

    const session = await authSessionsRepository.create({
      userId: user.id,
      expiresAt: new Date(),
    })

    const tokens = await generateAuthTokens(reply, user, session.id)
    const refreshTokenHash = hashRefreshToken(tokens.refreshToken)

    await authSessionsRepository.updateTokenData(session.id, {
      refreshTokenHash,
      expiresAt: tokens.refreshTokenExpiresAt,
    })

    setRefreshTokenCookie(reply, tokens.refreshToken)

    return reply.status(200).send({
      accessToken: tokens.accessToken,
    })
  } catch {
    return reply.status(401).send({
      message: 'Invalid credentials',
    })
  }
}
