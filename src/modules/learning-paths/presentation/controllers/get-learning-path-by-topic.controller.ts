import { FastifyReply, FastifyRequest } from 'fastify'
import { TopicLearningPathParamsDTO } from '../../application/dto/learning-path.dto'
import { GetLearningPathByTopicUseCase } from '../../application/use-cases/get-learning-path-by-topic.use-case'
import { LearningPathsRepository } from '../../repositories/learning-paths-repository'

export async function getLearningPathByTopicController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as TopicLearningPathParamsDTO
  const userId = request.user.sub

  const learningPathsRepository = new LearningPathsRepository()
  const getLearningPathByTopicUseCase = new GetLearningPathByTopicUseCase(
    learningPathsRepository
  )

  const learningPath = await getLearningPathByTopicUseCase.execute(id, userId)

  if (!learningPath) {
    return reply.status(404).send({
      message: 'Learning path not found',
    })
  }

  return reply.send(learningPath)
}
