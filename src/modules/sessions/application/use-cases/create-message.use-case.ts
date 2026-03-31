import { CreateMessageDataDTO } from '../dto/sessions.dto'
import { SessionsRepository } from '../../repositories/sessions-repository'

export class CreateMessageUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(data: CreateMessageDataDTO) {
    const session = await this.sessionsRepository.findByIdAndUserId(
      data.sessionId,
      data.userId
    )

    if (!session) {
      return null
    }

    return this.sessionsRepository.createMessage(data)
  }
}
