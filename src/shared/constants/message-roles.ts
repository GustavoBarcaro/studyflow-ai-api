export const MESSAGE_ROLES = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
} as const

export type MessageRole =
  (typeof MESSAGE_ROLES)[keyof typeof MESSAGE_ROLES]
