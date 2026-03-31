import { FastifyReply, FastifyRequest } from 'fastify'
import { TopicsRepository } from '../../../topics/repositories/topics-repository'
import { CreateSessionBodyDTO } from '../../application/dto/sessions.dto'
import { CreateSessionUseCase } from '../../application/use-cases/create-session.use-case'
import { SessionsRepository } from '../../repositories/sessions-repository'

export async function createSessionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { title, topicId } = request.body as CreateSessionBodyDTO
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const topicsRepository = new TopicsRepository()
  const createSessionUseCase = new CreateSessionUseCase(
    sessionsRepository,
    topicsRepository
  )

  const session = await createSessionUseCase.execute({
    title,
    topicId,
    userId,
  })

  if (!session) {
    return reply.status(404).send({
      message: 'Topic not found',
    })
  }

  return reply.status(201).send(session)
}
