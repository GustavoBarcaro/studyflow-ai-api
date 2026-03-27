import { prisma } from '../../../infra/db/prisma'
import { CreateTopicDTO } from '../application/dto/create-topic.dto'

export class TopicsRepository {
  async create(data: CreateTopicDTO) {
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