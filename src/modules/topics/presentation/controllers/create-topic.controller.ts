import { FastifyReply, FastifyRequest } from 'fastify'
import { TopicsRepository } from '../../repositories/topics-repository'
import { CreateTopicUseCase } from '../../application/use-cases/create-topic.use-case'

export async function createTopicController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name, color } = request.body as {
    name: string
    color: string
  }

  const userId = request.user.sub

  const topicsRepository = new TopicsRepository()
  const createTopicUseCase = new CreateTopicUseCase(topicsRepository)

  const topic = await createTopicUseCase.execute({
    name,
    color,
    userId,
  })

  return reply.status(201).send(topic)
}