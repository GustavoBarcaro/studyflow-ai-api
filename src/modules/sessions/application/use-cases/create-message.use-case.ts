import { AIProvider } from '../../../../infra/services/ai/ai-provider'
import { MESSAGE_ROLES } from '../../../../shared/constants/message-roles'
import {
  buildStudySessionTitlePrompt,
  buildStudyTopicPrompt,
  CHAT_SYSTEM_PROMPT,
} from '../../../../shared/prompts/study-prompts'
import { buildSessionContext } from '../../../../shared/utils/build-session-context'
import { CreateMessageDataDTO } from '../dto/sessions.dto'
import { SessionsRepository } from '../../repositories/sessions-repository'

const MAX_HISTORY_MESSAGES = 10

export class CreateMessageUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private aiProvider: AIProvider
  ) {}

  async execute(data: CreateMessageDataDTO) {
    const session = await this.sessionsRepository.findByIdAndUserIdWithRecentMessages(
      data.sessionId,
      data.userId,
      MAX_HISTORY_MESSAGES
    )

    if (!session) {
      return null
    }

    const userMessage = await this.sessionsRepository.createMessage(data)

    const historyMessages = buildSessionContext([...session.messages].reverse())

    const topic = session.topic.name
    const sessionTitle = session.title

    const aiResponse = await this.aiProvider.generateText({
      messages: [
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: CHAT_SYSTEM_PROMPT,
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildStudyTopicPrompt(topic),
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildStudySessionTitlePrompt(sessionTitle),
        },
        ...historyMessages,
        {
          role: MESSAGE_ROLES.USER,
          content: userMessage.content,
        },
      ],
    })

    const assistantMessage = await this.sessionsRepository.createMessage({
      sessionId: data.sessionId,
      userId: data.userId,
      role: MESSAGE_ROLES.ASSISTANT,
      content: aiResponse.text,
    })

    return {
      userMessage,
      assistantMessage,
    }
  }
}
