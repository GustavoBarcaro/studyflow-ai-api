import { AIProvider } from '../../../../infra/services/ai/ai-provider'
import { MESSAGE_ROLES } from '../../../../shared/constants/message-roles'
import {
  buildStudySessionTitlePrompt,
  buildStudyTopicPrompt,
  SUMMARIZE_SESSION_PROMPT,
} from '../../../../shared/prompts/study-prompts'
import { buildSessionContext } from '../../../../shared/utils/build-session-context'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'

export class SummarizeSessionUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private aiProvider: AIProvider
  ) {}

  async execute(sessionId: string, userId: string) {
    const session = await this.sessionsRepository.findByIdAndUserId(
      sessionId,
      userId
    )

    if (!session) {
      return null
    }

    const contextMessages = buildSessionContext(session.messages)

    const response = await this.aiProvider.generateText({
      messages: [
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: SUMMARIZE_SESSION_PROMPT,
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
      summary: response.text,
    }
  }
}
