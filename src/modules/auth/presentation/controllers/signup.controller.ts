import { FastifyReply, FastifyRequest } from 'fastify'
import { createUserBodySchema } from '../../application/dto/signup.dto'
import { UsersRepository } from '../../repositories/users-repository'
import { CreateUserUseCase } from '../../application/use-cases/signup.use-case'

export async function signUpController(
  request: FastifyRequest,
  reply: FastifyReply
) {

    console.log('signup hit')
  console.log('body:', request.body)
  const parsed = createUserBodySchema.safeParse(request.body)
 console.log('parsed:',parsed)
  if (!parsed.success) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: parsed.error.issues,
    })
  }

  try {
    const usersRepository = new UsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const user = await createUserUseCase.execute(parsed.data)

    return reply.status(201).send(user)
  } catch (err) {
    return reply.status(409).send({
      message: (err as Error).message,
    })
  }
}