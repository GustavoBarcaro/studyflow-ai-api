import { GroqProvider } from '../../../../infra/services/ai/groq-provider'
import { MESSAGE_ROLES } from '../../../../shared/constants/message-roles'
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
  const { content } = request.body as CreateMessageBodyDTO
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const aiProvider = new GroqProvider()
  const createMessageUseCase = new CreateMessageUseCase(
    sessionsRepository,
    aiProvider
  )

  const message = await createMessageUseCase.execute({
    sessionId: id,
    userId,
    role: MESSAGE_ROLES.USER,
    content,
  })

  if (!message) {
    return reply.status(404).send({
      message: 'Session not found',
    })
  }

  return reply.status(201).send(message)
}
