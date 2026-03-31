import { AIProviderMessage } from '../../infra/services/ai/ai-provider'
import { MESSAGE_ROLES } from '../constants/message-roles'

type SessionContextMessage = {
  role: string
  content: string
}

export function buildSessionContext(
  messages: SessionContextMessage[]
): AIProviderMessage[] {
  return messages.map((message) => ({
    role:
      message.role === MESSAGE_ROLES.ASSISTANT
        ? MESSAGE_ROLES.ASSISTANT
        : MESSAGE_ROLES.USER,
    content: message.content,
  }))
}
