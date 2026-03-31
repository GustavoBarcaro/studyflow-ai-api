import {
  AIProvider,
  AIProviderMessage,
} from '../../../../infra/services/ai/ai-provider'
import { MESSAGE_ROLES } from '../../../../shared/constants/message-roles'
import { CreateMessageDataDTO } from '../dto/sessions.dto'
import { SessionsRepository } from '../../repositories/sessions-repository'

const SYSTEM_PROMPT = `
You are a senior software engineer and tutor.

Rules:
- explain in simple terms
- always give examples
- keep answers concise
- if the user makes a typo, assume intent and correct silently
- adapt explanation for beginners
`.trim()

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

    const historyMessages: AIProviderMessage[] = session.messages
      .reverse()
      .map((message) => ({
        role:
          message.role === MESSAGE_ROLES.ASSISTANT
            ? MESSAGE_ROLES.ASSISTANT
            : MESSAGE_ROLES.USER,
        content: message.content,
      }))

    const topic = session.topic.name
    const sessionTitle = session.title

    const aiResponse = await this.aiProvider.generateText({
      messages: [
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: SYSTEM_PROMPT,
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: `The user is studying: ${topic}`,
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: `Current session title: ${sessionTitle}`,
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
