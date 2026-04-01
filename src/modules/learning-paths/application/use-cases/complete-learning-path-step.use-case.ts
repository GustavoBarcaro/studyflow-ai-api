import { UpdateLearningPathStepDataDTO } from '../dto/learning-path.dto'
import { LearningPathsRepository } from '../../repositories/learning-paths-repository'

export class CompleteLearningPathStepUseCase {
  constructor(private learningPathsRepository: LearningPathsRepository) {}

  async execute(data: UpdateLearningPathStepDataDTO) {
    return this.learningPathsRepository.markStepCompleted(data.stepId, data.userId)
  }
}
