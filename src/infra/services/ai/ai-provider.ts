import { MessageRole } from '../../../shared/constants/message-roles'

export type AIProviderMessage = {
  role: MessageRole
  content: string
}

export type AIProviderGenerateTextInput = {
  messages: AIProviderMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
}

export type AIProviderGenerateTextOutput = {
  text: string
  model: string
  finishReason?: string
}

export interface AIProvider {
  generateText(
    input: AIProviderGenerateTextInput
  ): Promise<AIProviderGenerateTextOutput>
}
