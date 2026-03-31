import { AIProvider } from '../../../../infra/services/ai/ai-provider'
import { MESSAGE_ROLES } from '../../../../shared/constants/message-roles'
import { StudyLevel } from '../../../../shared/constants/study-levels'
import {
  buildExplainAgainPrompt,
  buildStudySessionTitlePrompt,
  buildStudyTopicPrompt,
} from '../../../../shared/prompts/study-prompts'
import { buildSessionContext } from '../../../../shared/utils/build-session-context'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'

type ExplainAgainInput = {
  sessionId: string
  userId: string
  level: StudyLevel
  focus?: string
}

export class ExplainAgainUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private aiProvider: AIProvider
  ) {}

  async execute(input: ExplainAgainInput) {
    const session = await this.sessionsRepository.findByIdAndUserId(
      input.sessionId,
      input.userId
    )

    if (!session) {
      return null
    }

    const contextMessages = buildSessionContext(session.messages)

    const response = await this.aiProvider.generateText({
      messages: [
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildExplainAgainPrompt(input.level, input.focus),
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildStudyTopicPrompt(session.topic.name),
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildStudySessionTitlePrompt(session.title),
        },
        ...contextMessages,
      ],
    })

    return {
      explanation: response.text,
    }
  }
}
