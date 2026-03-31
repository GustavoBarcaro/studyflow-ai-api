import { SignUpBodyDTO } from './../../application/dto/signup.dto';
import { FastifyReply, FastifyRequest } from 'fastify'
import { UsersRepository } from '../../repositories/users-repository'
import { CreateUserUseCase } from '../../application/use-cases/signup.use-case'
import { AuthSessionsRepository } from '../../repositories/auth-sessions-repository'
import { generateAuthTokens } from '../../../../infra/auth/tokens'
import { hashRefreshToken } from '../../../../infra/auth/refresh-token-hash'
import { setRefreshTokenCookie } from '../../../../infra/auth/refresh-token-cookie'

export async function signUpController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password, name } = request.body as SignUpBodyDTO

  try {
    const usersRepository = new UsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const user = await createUserUseCase.execute({
      email,
      password,
      name,
    })

    const authSessionsRepository = new AuthSessionsRepository()
    const session = await authSessionsRepository.create({
      userId: user.id,
      expiresAt: new Date(),
    })

    const tokens = await generateAuthTokens(reply, user, session.id)

    await authSessionsRepository.updateTokenData(session.id, {
      refreshTokenHash: hashRefreshToken(tokens.refreshToken),
      expiresAt: tokens.refreshTokenExpiresAt,
    })

    setRefreshTokenCookie(reply, tokens.refreshToken)

    return reply.status(201).send({
      user,
      accessToken: tokens.accessToken,
    })
  } catch (err) {
    return reply.status(409).send({
      message: (err as Error).message,
    })
  }
}
