import { MessageRole } from '../../../shared/constants/message-roles'
import { ZodType } from 'zod'

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

export type AIProviderGenerateObjectInput<T> = {
  messages: AIProviderMessage[]
  schema: ZodType<T>
  schemaName?: string
  schemaDescription?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export type AIProviderGenerateObjectOutput<T> = {
  object: T
  model: string
  finishReason?: string
}

export interface AIProvider {
  generateText(
    input: AIProviderGenerateTextInput
  ): Promise<AIProviderGenerateTextOutput>

  generateObject<T>(
    input: AIProviderGenerateObjectInput<T>
  ): Promise<AIProviderGenerateObjectOutput<T>>
}
