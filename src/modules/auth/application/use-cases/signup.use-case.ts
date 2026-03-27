import { hash } from 'bcryptjs'
import { UsersRepository } from '../../repositories/users-repository'

type CreateUserInput = {
  email: string
  password: string
  name?: string
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password: passwordData, name }: CreateUserInput) {
    const existingUser = await this.usersRepository.findByEmail(email)

    if (existingUser) {
      throw new Error('User already exists')
    }

    const password = await hash(passwordData, 10)

    const user = await this.usersRepository.create({
      email,
      password,
      name,
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }
}