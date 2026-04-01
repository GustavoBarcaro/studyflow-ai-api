import { UpdateLearningPathStepDataDTO } from '../dto/learning-path.dto'
import { LearningPathsRepository } from '../../repositories/learning-paths-repository'

export class IncompleteLearningPathStepUseCase {
  constructor(private learningPathsRepository: LearningPathsRepository) {}

  async execute(data: UpdateLearningPathStepDataDTO) {
    return this.learningPathsRepository.markStepIncomplete(
      data.stepId,
      data.userId
    )
  }
}
