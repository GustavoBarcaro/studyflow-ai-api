import { FastifyReply, FastifyRequest } from 'fastify'
import { GetTopicsUseCase } from '../../application/use-cases/get-topics.use-case'
import { TopicsRepository } from '../../repositories/topics-repository'

export async function getTopicsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub

  const topicsRepository = new TopicsRepository()
  const getTopicsUseCase = new GetTopicsUseCase(topicsRepository)

  const topics = await getTopicsUseCase.execute(userId)

  return reply.send(topics)
}
