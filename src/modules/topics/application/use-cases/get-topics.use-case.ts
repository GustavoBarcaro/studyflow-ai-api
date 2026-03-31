import { TopicsRepository } from '../../repositories/topics-repository'

export class GetTopicsUseCase {
  constructor(private topicsRepository: TopicsRepository) {}

  async execute(userId: string) {
    return this.topicsRepository.findManyByUserId(userId)
  }
}
