import { SignUpBodyDTO } from './../../application/dto/signup.dto';
import { FastifyReply, FastifyRequest } from 'fastify'
import { UsersRepository } from '../../repositories/users-repository'
import { CreateUserUseCase } from '../../application/use-cases/signup.use-case'

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

    return reply.status(201).send(user)
  } catch (err) {
    return reply.status(409).send({
      message: (err as Error).message,
    })
  }
}