import { FastifyReply, FastifyRequest } from 'fastify'
import { TopicParamsDTO } from '../../application/dto/create-topic.dto'
import { DeleteTopicUseCase } from '../../application/use-cases/delete-topic.use-case'
import { TopicsRepository } from '../../repositories/topics-repository'

export async function deleteTopicController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as TopicParamsDTO
  const userId = request.user.sub

  const topicsRepository = new TopicsRepository()
  const deleteTopicUseCase = new DeleteTopicUseCase(topicsRepository)

  const topic = await deleteTopicUseCase.execute({
    id,
    userId,
  })

  if (!topic) {
    return reply.status(404).send({
      message: 'Topic not found',
    })
  }

  return reply.status(204).send()
}
