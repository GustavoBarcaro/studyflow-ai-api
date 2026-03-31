import { prisma } from '../../../infra/db/prisma'

export class AuthSessionsRepository {
  async create(data: { userId: string; expiresAt: Date }) {
    return prisma.authSession.create({
      data: {
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    })
  }

  async findById(id: string) {
    return prisma.authSession.findUnique({
      where: { id },
    })
  }

  async updateTokenData(
    id: string,
    data: { refreshTokenHash: string; expiresAt: Date }
  ) {
    return prisma.authSession.update({
      where: { id },
      data: {
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
        lastUsedAt: new Date(),
      },
    })
  }

  async revoke(id: string) {
    return prisma.authSession.update({
      where: { id },
      data: {
        revokedAt: new Date(),
      },
    })
  }
}
