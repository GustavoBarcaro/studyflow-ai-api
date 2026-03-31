import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import {
  AIProvider,
  AIProviderGenerateTextInput,
  AIProviderGenerateTextOutput,
} from './ai-provider'

export class GroqProvider implements AIProvider {
  private readonly provider
  private readonly defaultModel: string

  constructor() {
    this.defaultModel =
      process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

    this.provider = createGroq({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: process.env.GROQ_BASE_URL,
    })
  }

  async generateText(
    input: AIProviderGenerateTextInput
  ): Promise<AIProviderGenerateTextOutput> {
    const model = input.model || this.defaultModel

    const result = await generateText({
      model: this.provider(model),
      messages: input.messages,
      temperature: input.temperature,
      maxOutputTokens: input.maxTokens,
    })

    const text = result.text.trim()

    if (!text) {
      throw new Error('Groq returned an empty response')
    }

    return {
      text,
      model: result.response.modelId || model,
      finishReason: result.finishReason,
    }
  }
}
