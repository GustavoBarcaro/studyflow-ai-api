import { prisma } from '../../../infra/db/prisma'

export class UsersRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  async create(data: {
    email: string
    password: string
    name?: string
  }) {
    return prisma.user.create({
      data,
    })
  }
}
