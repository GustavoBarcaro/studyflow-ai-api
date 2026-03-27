import { UsersRepository } from '../../repositories/users-repository'
import { BcryptHasher } from '../../../../infra/services/hash-bcrypt'
import { LoginDTO } from '../dto/login.dto'

export class LoginUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: BcryptHasher
  ) {}

  async execute(data: LoginDTO) {
    const user = await this.usersRepository.findByEmail(data.email)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const passwordMatches = await this.hasher.compare(
      data.password,
      user.password
    )

    if (!passwordMatches) {
      throw new Error('Invalid credentials')
    }

    return {
      id: user.id,
      email: user.email,
    }
  }
}