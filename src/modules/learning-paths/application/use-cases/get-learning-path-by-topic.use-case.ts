import { LearningPathsRepository } from '../../repositories/learning-paths-repository'

export class GetLearningPathByTopicUseCase {
  constructor(private learningPathsRepository: LearningPathsRepository) {}

  async execute(topicId: string, userId: string) {
    return this.learningPathsRepository.findActiveByTopicAndUserId(
      topicId,
      userId
    )
  }
}
