import { FastifyReply, FastifyRequest } from 'fastify'
import { SessionParamsDTO } from '../../application/dto/sessions.dto'
import { DeleteSessionUseCase } from '../../application/use-cases/delete-session.use-case'
import { SessionsRepository } from '../../repositories/sessions-repository'

export async function deleteSessionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as SessionParamsDTO
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const deleteSessionUseCase = new DeleteSessionUseCase(sessionsRepository)

  const session = await deleteSessionUseCase.execute({
    id,
    userId,
  })

  if (!session) {
    return reply.status(404).send({
      message: 'Session not found',
    })
  }

  return reply.status(204).send()
}
