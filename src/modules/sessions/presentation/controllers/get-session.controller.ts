import { FastifyReply, FastifyRequest } from 'fastify'
import { SessionParamsDTO } from '../../application/dto/sessions.dto'
import { GetSessionUseCase } from '../../application/use-cases/get-session.use-case'
import { SessionsRepository } from '../../repositories/sessions-repository'

export async function getSessionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as SessionParamsDTO
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const getSessionUseCase = new GetSessionUseCase(sessionsRepository)

  const session = await getSessionUseCase.execute(id, userId)

  if (!session) {
    return reply.status(404).send({
      message: 'Session not found',
    })
  }

  return reply.send(session)
}
