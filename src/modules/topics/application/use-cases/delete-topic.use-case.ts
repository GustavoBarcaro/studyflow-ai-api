import { DeleteTopicDataDTO } from '../dto/create-topic.dto'
import { TopicsRepository } from '../../repositories/topics-repository'

export class DeleteTopicUseCase {
  constructor(private topicsRepository: TopicsRepository) {}

  async execute(data: DeleteTopicDataDTO) {
    return this.topicsRepository.delete(data)
  }
}
