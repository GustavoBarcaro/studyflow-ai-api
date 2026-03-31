import { TopicsRepository } from '../../repositories/topics-repository'

export class GetTopicUseCase {
  constructor(private topicsRepository: TopicsRepository) {}

  async execute(id: string, userId: string) {
    return this.topicsRepository.findByIdAndUserId(id, userId)
  }
}
