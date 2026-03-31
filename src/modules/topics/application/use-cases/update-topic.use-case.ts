import { UpdateTopicDataDTO } from '../dto/create-topic.dto'
import { TopicsRepository } from '../../repositories/topics-repository'

export class UpdateTopicUseCase {
  constructor(private topicsRepository: TopicsRepository) {}

  async execute(data: UpdateTopicDataDTO) {
    return this.topicsRepository.update(data)
  }
}
