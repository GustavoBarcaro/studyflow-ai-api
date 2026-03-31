import { FastifyReply, FastifyRequest } from 'fastify'
import { SessionParamsDTO } from '../../application/dto/sessions.dto'
import { GetSessionMessagesUseCase } from '../../application/use-cases/get-session-messages.use-case'
import { SessionsRepository } from '../../repositories/sessions-repository'

export async function getSessionMessagesController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as SessionParamsDTO
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const getSessionMessagesUseCase = new GetSessionMessagesUseCase(
    sessionsRepository
  )

  const messages = await getSessionMessagesUseCase.execute(id, userId)

  if (!messages) {
    return reply.status(404).send({
      message: 'Session not found',
    })
  }

  return reply.send(messages)
}
