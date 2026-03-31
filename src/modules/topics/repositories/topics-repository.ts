import { prisma } from '../../../infra/db/prisma'
import {
  CreateTopicDataDTO,
  DeleteTopicDataDTO,
  UpdateTopicDataDTO,
} from '../application/dto/create-topic.dto'

export class TopicsRepository {
  async create(data: CreateTopicDataDTO) {
    return prisma.topic.create({
      data: {
        name: data.name,
        color: data.color,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    })
  }

  async findManyByUserId(userId: string) {
    return prisma.topic.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findByIdAndUserId(id: string, userId: string) {
    return prisma.topic.findFirst({
      where: {
        id,
        userId,
      },
    })
  }

  async update(data: UpdateTopicDataDTO) {
    const topic = await this.findByIdAndUserId(data.id, data.userId)

    if (!topic) {
      return null
    }

    return prisma.topic.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        color: data.color,
      },
    })
  }

  async delete(data: DeleteTopicDataDTO) {
    const topic = await this.findByIdAndUserId(data.id, data.userId)

    if (!topic) {
      return null
    }

    await prisma.topic.delete({
      where: {
        id: data.id,
      },
    })

    return topic
  }
}
