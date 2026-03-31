import { DeleteSessionDataDTO } from '../dto/sessions.dto'
import { SessionsRepository } from '../../repositories/sessions-repository'

export class DeleteSessionUseCase {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(data: DeleteSessionDataDTO) {
    return this.sessionsRepository.delete(data)
  }
}
