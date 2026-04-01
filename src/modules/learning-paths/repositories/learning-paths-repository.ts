import { prisma } from '../../../infra/db/prisma'
import { LEARNING_PATH_STATUSES } from '../../../shared/constants/learning-path-statuses'

type CreateLearningPathRepositoryInput = {
  userId: string
  topicId: string
  title: string
  description: string
  steps: Array<{
    title: string
    description: string
    order: number
  }>
}

export class LearningPathsRepository {
  async findActiveByTopicAndUserId(topicId: string, userId: string) {
    return prisma.learningPath.findFirst({
      where: {
        topicId,
        userId,
        status: LEARNING_PATH_STATUSES.ACTIVE,
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async create(data: CreateLearningPathRepositoryInput) {
    return prisma.learningPath.create({
      data: {
        userId: data.userId,
        topicId: data.topicId,
        title: data.title,
        description: data.description,
        status: LEARNING_PATH_STATUSES.ACTIVE,
        steps: {
          create: data.steps.map((step) => ({
            title: step.title,
            description: step.description,
            order: step.order,
          })),
        },
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })
  }

  async findStepByIdAndUserId(stepId: string, userId: string) {
    return prisma.learningPathStep.findFirst({
      where: {
        id: stepId,
        learningPath: {
          userId,
        },
      },
      include: {
        learningPath: {
          include: {
            topic: true,
          },
        },
      },
    })
  }

  async markStepCompleted(stepId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const step = await tx.learningPathStep.findFirst({
        where: {
          id: stepId,
          learningPath: {
            userId,
          },
        },
      })

      if (!step) {
        return null
      }

      const updatedStep = await tx.learningPathStep.update({
        where: {
          id: stepId,
        },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      })

      const incompleteStepsCount = await tx.learningPathStep.count({
        where: {
          learningPathId: step.learningPathId,
          completed: false,
        },
      })

      await tx.learningPath.update({
        where: {
          id: step.learningPathId,
        },
        data: {
          status:
            incompleteStepsCount === 0
              ? LEARNING_PATH_STATUSES.COMPLETED
              : LEARNING_PATH_STATUSES.ACTIVE,
        },
      })

      return updatedStep
    })
  }

  async markStepIncomplete(stepId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const step = await tx.learningPathStep.findFirst({
        where: {
          id: stepId,
          learningPath: {
            userId,
          },
        },
      })

      if (!step) {
        return null
      }

      const updatedStep = await tx.learningPathStep.update({
        where: {
          id: stepId,
        },
        data: {
          completed: false,
          completedAt: null,
        },
      })

      await tx.learningPath.update({
        where: {
          id: step.learningPathId,
        },
        data: {
          status: LEARNING_PATH_STATUSES.ACTIVE,
        },
      })

      return updatedStep
    })
  }
}
