import { FastifyReply, FastifyRequest } from 'fastify'
import { GetTopicUseCase } from '../../application/use-cases/get-topic.use-case'
import { TopicParamsDTO } from '../../application/dto/create-topic.dto'
import { TopicsRepository } from '../../repositories/topics-repository'

export async function getTopicController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as TopicParamsDTO
  const userId = request.user.sub

  const topicsRepository = new TopicsRepository()
  const getTopicUseCase = new GetTopicUseCase(topicsRepository)

  const topic = await getTopicUseCase.execute(id, userId)

  if (!topic) {
    return reply.status(404).send({
      message: 'Topic not found',
    })
  }

  return reply.send(topic)
}
