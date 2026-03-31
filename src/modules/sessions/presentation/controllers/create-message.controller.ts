import { FastifyReply, FastifyRequest } from 'fastify'
import {
  CreateMessageBodyDTO,
  SessionParamsDTO,
} from '../../application/dto/sessions.dto'
import { CreateMessageUseCase } from '../../application/use-cases/create-message.use-case'
import { SessionsRepository } from '../../repositories/sessions-repository'

export async function createMessageController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as SessionParamsDTO
  const { role, content } = request.body as CreateMessageBodyDTO
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const createMessageUseCase = new CreateMessageUseCase(sessionsRepository)

  const message = await createMessageUseCase.execute({
    sessionId: id,
    userId,
    role,
    content,
  })

  if (!message) {
    return reply.status(404).send({
      message: 'Session not found',
    })
  }

  return reply.status(201).send(message)
}
