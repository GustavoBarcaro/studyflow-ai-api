import { SessionsRepository } from '../../repositories/sessions-repository'

export class GetSessionMessagesUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(id: string, userId: string) {
    const session = await this.sessionsRepository.findByIdAndUserId(id, userId)

    if (!session) {
      return null
    }

    return session.messages
  }
}
