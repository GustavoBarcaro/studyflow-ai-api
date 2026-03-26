import { prisma } from '../../infra/db/prisma'

export async function createTopic(data: { name: string; color: string; userId: string }) {
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