import { SessionsRepository } from '../../repositories/sessions-repository'

export class GetSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(id: string, userId: string) {
    return this.sessionsRepository.findByIdAndUserId(id, userId)
  }
}
