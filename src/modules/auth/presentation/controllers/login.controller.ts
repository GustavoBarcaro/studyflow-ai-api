import { FastifyReply, FastifyRequest } from 'fastify'
import { UsersRepository } from '../../repositories/users-repository'
import { BcryptHasher } from '../../../../infra/services/hash-bcrypt'
import { LoginUseCase } from '../../application/use-cases/login.use-case'

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as {
    email: string
    password: string
  }

  try {
    const usersRepository = new UsersRepository()
    const hasher = new BcryptHasher()
    const loginUseCase = new LoginUseCase(usersRepository, hasher)

    const user = await loginUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {
        sub: user.id,
        email: user.email,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '15m',
        },
      }
    )

    return reply.status(200).send({
      token,
    })
  } catch {
    return reply.status(401).send({
      message: 'Invalid credentials',
    })
  }
}