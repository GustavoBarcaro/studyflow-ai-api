import { FastifyReply, FastifyRequest } from 'fastify'
import { GetSessionsUseCase } from '../../application/use-cases/get-sessions.use-case'
import { SessionsRepository } from '../../repositories/sessions-repository'

export async function getSessionsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const getSessionsUseCase = new GetSessionsUseCase(sessionsRepository)

  const sessions = await getSessionsUseCase.execute(userId)

  return reply.send(sessions)
}
