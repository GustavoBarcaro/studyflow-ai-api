import { prisma } from '../../../infra/db/prisma'
import {
  CreateMessageDataDTO,
  CreateSessionDataDTO,
  DeleteSessionDataDTO,
} from '../application/dto/sessions.dto'

export class SessionsRepository {
  async create(data: CreateSessionDataDTO) {
    return prisma.studySession.create({
      data: {
        title: data.title,
        user: {
          connect: {
            id: data.userId,
          },
        },
        topic: {
          connect: {
            id: data.topicId,
          },
        },
      },
      include: {
        topic: true,
      },
    })
  }

  async findManyByUserId(userId: string) {
    return prisma.studySession.findMany({
      where: {
        userId,
      },
      include: {
        topic: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findByIdAndUserId(id: string, userId: string) {
    return prisma.studySession.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        topic: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })
  }

  async findByIdAndUserIdWithRecentMessages(
    id: string,
    userId: string,
    limit: number
  ) {
    return prisma.studySession.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        topic: true,
        messages: {
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
  }

  async findRecentByTopicAndUserId(
    topicId: string,
    userId: string,
    limit: number
  ) {
    return prisma.studySession.findMany({
      where: {
        topicId,
        userId,
      },
      include: {
        topic: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })
  }

  async createMessage(data: CreateMessageDataDTO) {
    return prisma.message.create({
      data: {
        role: data.role,
        content: data.content,
        session: {
          connect: {
            id: data.sessionId,
          },
        },
      },
    })
  }

  async delete(data: DeleteSessionDataDTO) {
    const session = await this.findByIdAndUserId(data.id, data.userId)

    if (!session) {
      return null
    }

    await prisma.studySession.delete({
      where: {
        id: data.id,
      },
    })

    return session
  }
}
