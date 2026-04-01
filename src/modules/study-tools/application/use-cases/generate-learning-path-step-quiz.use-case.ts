import { AIProvider } from '../../../../infra/services/ai/ai-provider'
import { MESSAGE_ROLES } from '../../../../shared/constants/message-roles'
import { QuizDifficulty } from '../../../../shared/constants/quiz-difficulties'
import {
  buildGenerateQuizPrompt,
  buildLearningPathPrompt,
  buildLearningPathStepPrompt,
  buildStudySessionTitlePrompt,
  buildStudyTopicPrompt,
} from '../../../../shared/prompts/study-prompts'
import { buildSessionContext } from '../../../../shared/utils/build-session-context'
import { LearningPathsRepository } from '../../../learning-paths/repositories/learning-paths-repository'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'
import { parseQuizResponse } from '../parsers/parse-quiz-response'

type GenerateLearningPathStepQuizInput = {
  stepId: string
  userId: string
  questions: number
  difficulty: QuizDifficulty
}

export class GenerateLearningPathStepQuizUseCase {
  constructor(
    private learningPathsRepository: LearningPathsRepository,
    private sessionsRepository: SessionsRepository,
    private aiProvider: AIProvider
  ) {}

  async execute(input: GenerateLearningPathStepQuizInput) {
    const step = await this.learningPathsRepository.findStepByIdAndUserId(
      input.stepId,
      input.userId
    )

    if (!step) {
      return null
    }

    const sessions = await this.sessionsRepository.findRecentByTopicAndUserId(
      step.learningPath.topicId,
      input.userId,
      3
    )

    const contextMessages = sessions.flatMap((session) => [
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
          content: buildGenerateQuizPrompt(input.questions, input.difficulty),
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildStudyTopicPrompt(step.learningPath.topic.name),
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildLearningPathPrompt(
            step.learningPath.title,
            step.learningPath.description
          ),
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildLearningPathStepPrompt(step.title, step.description),
        },
        ...contextMessages,
      ],
    })

    const quiz = parseQuizResponse(response.text)

    return {
      ...quiz,
      learningPathStep: {
        id: step.id,
        learningPathId: step.learningPathId,
        title: step.title,
        description: step.description,
        order: step.order,
      },
      learningPath: {
        id: step.learningPath.id,
        topicId: step.learningPath.topicId,
        title: step.learningPath.title,
        description: step.learningPath.description,
        status: step.learningPath.status,
      },
    }
  }
}
