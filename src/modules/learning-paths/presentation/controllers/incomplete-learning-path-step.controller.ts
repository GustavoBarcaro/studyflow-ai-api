import { FastifyReply, FastifyRequest } from 'fastify'
import { LearningPathStepParamsDTO } from '../../application/dto/learning-path.dto'
import { IncompleteLearningPathStepUseCase } from '../../application/use-cases/incomplete-learning-path-step.use-case'
import { LearningPathsRepository } from '../../repositories/learning-paths-repository'

export async function incompleteLearningPathStepController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as LearningPathStepParamsDTO
  const userId = request.user.sub

  const learningPathsRepository = new LearningPathsRepository()
  const incompleteLearningPathStepUseCase =
    new IncompleteLearningPathStepUseCase(learningPathsRepository)

  const step = await incompleteLearningPathStepUseCase.execute({
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
