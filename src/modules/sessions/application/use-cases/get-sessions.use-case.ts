import { SessionsRepository } from '../../repositories/sessions-repository'

export class GetSessionsUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(userId: string) {
    return this.sessionsRepository.findManyByUserId(userId)
  }
}
