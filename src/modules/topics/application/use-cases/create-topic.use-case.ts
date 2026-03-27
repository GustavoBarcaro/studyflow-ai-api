import { CreateTopicDTO } from '../dto/create-topic.dto'
import { TopicsRepository } from '../../repositories/topics-repository'

export class CreateTopicUseCase {
  constructor(private topicsRepository: TopicsRepository) {}

  async execute(data: CreateTopicDTO) {
    return this.topicsRepository.create(data)
  }
}