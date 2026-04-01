import { FastifyReply, FastifyRequest } from 'fastify'
import { LearningPathStepParamsDTO } from '../../application/dto/learning-path.dto'
import { CompleteLearningPathStepUseCase } from '../../application/use-cases/complete-learning-path-step.use-case'
import { LearningPathsRepository } from '../../repositories/learning-paths-repository'

export async function completeLearningPathStepController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as LearningPathStepParamsDTO
  const userId = request.user.sub

  const learningPathsRepository = new LearningPathsRepository()
  const completeLearningPathStepUseCase = new CompleteLearningPathStepUseCase(
    learningPathsRepository
  )

  const step = await completeLearningPathStepUseCase.execute({
    stepId: id,
    userId,
  })

  if (!step) {
    return reply.status(404).send({
      message: 'Learning path step not found',
    })
  }

  return reply.send(step)
}
