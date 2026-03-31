import { FastifyReply, FastifyRequest } from 'fastify'
import {
  TopicParamsDTO,
  UpdateTopicBodyDTO,
} from '../../application/dto/create-topic.dto'
import { UpdateTopicUseCase } from '../../application/use-cases/update-topic.use-case'
import { TopicsRepository } from '../../repositories/topics-repository'

export async function updateTopicController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as TopicParamsDTO
  const { name, color } = request.body as UpdateTopicBodyDTO
  const userId = request.user.sub

  const topicsRepository = new TopicsRepository()
  const updateTopicUseCase = new UpdateTopicUseCase(topicsRepository)

  const topic = await updateTopicUseCase.execute({
    id,
    userId,
    name,
    color,
  })

  if (!topic) {
    return reply.status(404).send({
      message: 'Topic not found',
    })
  }

  return reply.send(topic)
}
