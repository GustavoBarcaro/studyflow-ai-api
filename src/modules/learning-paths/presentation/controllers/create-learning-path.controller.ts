import { FastifyReply, FastifyRequest } from 'fastify'
import { GroqProvider } from '../../../../infra/services/ai/groq-provider'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'
import { TopicsRepository } from '../../../topics/repositories/topics-repository'
import {
  CreateLearningPathBodyDTO,
  TopicLearningPathParamsDTO,
} from '../../application/dto/learning-path.dto'
import { CreateLearningPathUseCase } from '../../application/use-cases/create-learning-path.use-case'
import { LearningPathsRepository } from '../../repositories/learning-paths-repository'

export async function createLearningPathController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as TopicLearningPathParamsDTO
  const body = (request.body || {}) as CreateLearningPathBodyDTO
  const userId = request.user.sub

  const topicsRepository = new TopicsRepository()
  const sessionsRepository = new SessionsRepository()
  const learningPathsRepository = new LearningPathsRepository()
  const aiProvider = new GroqProvider()
  const createLearningPathUseCase = new CreateLearningPathUseCase(
    topicsRepository,
    sessionsRepository,
    learningPathsRepository,
    aiProvider
  )

  const result = await createLearningPathUseCase.execute({
    topicId: id,
    userId,
    goal: body?.goal,
    sessionId: body?.sessionId,
  })

  if (!result) {
    return reply.status(404).send({
      message: 'Topic not found',
    })
  }

  return reply.status(result.created ? 201 : 200).send(result.learningPath)
}
