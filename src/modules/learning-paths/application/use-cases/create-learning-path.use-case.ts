import { AIProvider } from '../../../../infra/services/ai/ai-provider'
import { MESSAGE_ROLES } from '../../../../shared/constants/message-roles'
import {
  buildGenerateLearningPathPrompt,
  buildStudySessionTitlePrompt,
  buildStudyTopicPrompt,
} from '../../../../shared/prompts/study-prompts'
import { buildSessionContext } from '../../../../shared/utils/build-session-context'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'
import { TopicsRepository } from '../../../topics/repositories/topics-repository'
import { CreateLearningPathDataDTO } from '../dto/learning-path.dto'
import { parseLearningPathResponse } from '../parsers/parse-learning-path-response'
import { LearningPathsRepository } from '../../repositories/learning-paths-repository'

type CreateLearningPathResult = {
  learningPath: Awaited<ReturnType<LearningPathsRepository['create']>>
  created: boolean
}

export class CreateLearningPathUseCase {
  constructor(
    private topicsRepository: TopicsRepository,
    private sessionsRepository: SessionsRepository,
    private learningPathsRepository: LearningPathsRepository,
    private aiProvider: AIProvider
  ) {}

  async execute(
    input: CreateLearningPathDataDTO
  ): Promise<CreateLearningPathResult | null> {
    const topic = await this.topicsRepository.findByIdAndUserId(
      input.topicId,
      input.userId
    )

    if (!topic) {
      return null
    }

    const existingLearningPath =
      await this.learningPathsRepository.findActiveByTopicAndUserId(
        input.topicId,
        input.userId
      )

    if (existingLearningPath) {
      return {
        learningPath: existingLearningPath,
        created: false,
      }
    }

    const sessions = input.sessionId
      ? await this.loadRequestedSession(input.sessionId, input.userId, input.topicId)
      : await this.sessionsRepository.findRecentByTopicAndUserId(
          input.topicId,
          input.userId,
          3
        )

    const sessionContextMessages = sessions.flatMap((session) => [
      {
        role: MESSAGE_ROLES.SYSTEM,
        content: buildStudySessionTitlePrompt(session.title),
      },
      ...buildSessionContext(session.messages),
    ])

    const response = await this.aiProvider.generateText({
      messages: [
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildGenerateLearningPathPrompt(input.goal),
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildStudyTopicPrompt(topic.name),
        },
        ...sessionContextMessages,
      ],
    })

    const parsedLearningPath = parseLearningPathResponse(response.text)

    const learningPath = await this.learningPathsRepository.create({
      userId: input.userId,
      topicId: input.topicId,
      title: parsedLearningPath.title,
      description: parsedLearningPath.description,
      steps: parsedLearningPath.steps.map((step: {
        title: string
        description: string
        order: number
      }) => ({
        title: step.title,
        description: step.description,
        order: step.order,
      })),
    })

    return {
      learningPath,
      created: true,
    }
  }

  private async loadRequestedSession(
    sessionId: string,
    userId: string,
    topicId: string
  ) {
    const session = await this.sessionsRepository.findByIdAndUserId(
      sessionId,
      userId
    )

    if (!session || session.topicId !== topicId) {
      return []
    }

    return [session]
  }
}
