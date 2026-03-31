import { CreateSessionDataDTO } from '../dto/sessions.dto'
import { TopicsRepository } from '../../../topics/repositories/topics-repository'
import { SessionsRepository } from '../../repositories/sessions-repository'

export class CreateSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private topicsRepository: TopicsRepository
  ) {}

  async execute(data: CreateSessionDataDTO) {
    const topic = await this.topicsRepository.findByIdAndUserId(
      data.topicId,
      data.userId
    )

    if (!topic) {
      return null
    }

    return this.sessionsRepository.create(data)
  }
}
