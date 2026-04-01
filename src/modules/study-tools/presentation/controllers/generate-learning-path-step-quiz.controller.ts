import { FastifyReply, FastifyRequest } from 'fastify'
import { GroqProvider } from '../../../../infra/services/ai/groq-provider'
import { LearningPathsRepository } from '../../../learning-paths/repositories/learning-paths-repository'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'
import {
  GenerateLearningPathStepQuizParamsDTO,
  GenerateQuizBodyDTO,
} from '../../application/dto/quiz.dto'
import { GenerateLearningPathStepQuizUseCase } from '../../application/use-cases/generate-learning-path-step-quiz.use-case'

export async function generateLearningPathStepQuizController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as GenerateLearningPathStepQuizParamsDTO
  const { questions, difficulty } = request.body as GenerateQuizBodyDTO
  const userId = request.user.sub

  const learningPathsRepository = new LearningPathsRepository()
  const sessionsRepository = new SessionsRepository()
  const aiProvider = new GroqProvider()
  const generateLearningPathStepQuizUseCase =
    new GenerateLearningPathStepQuizUseCase(
      learningPathsRepository,
      sessionsRepository,
      aiProvider
    )

  const result = await generateLearningPathStepQuizUseCase.execute({
    stepId: id,
    userId,
    questions,
    difficulty,
  })

  if (!result) {
    return reply.status(404).send({
      message: 'Learning path step not found',
    })
  }

  return reply.send(result)
}
