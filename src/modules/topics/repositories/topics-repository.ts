import { prisma } from '../../../infra/db/prisma'
import { CreateTopicDataDTO } from '../application/dto/create-topic.dto'

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
}