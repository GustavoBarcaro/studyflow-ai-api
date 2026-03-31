import { QUIZ_OPTION_ID_VALUES } from '../../../../shared/constants/quiz-option-ids'
import { generateQuizResponseSchema } from '../dto/quiz.dto'

function removeMarkdownCodeFence(value: string) {
  return value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
}

function extractJSONObject(value: string) {
  const cleaned = removeMarkdownCodeFence(value)

  try {
    return JSON.parse(cleaned)
  } catch {
    let depth = 0
    let start = -1

    for (let index = 0; index < cleaned.length; index++) {
      const char = cleaned[index]

      if (char === '{') {
        if (depth === 0) {
          start = index
        }

        depth++
      } else if (char === '}') {
        depth--

        if (depth === 0 && start >= 0) {
          const candidate = cleaned.slice(start, index + 1)

          try {
            return JSON.parse(candidate)
          } catch {
            start = -1
          }
        }
      }
    }
  }

  throw new Error('Invalid quiz JSON returned by AI')
}

function normalizeOptionId(id: unknown, index: number) {
  if (typeof id === 'string') {
    const normalized = id.trim().toUpperCase()

    if (QUIZ_OPTION_ID_VALUES.includes(normalized as any)) {
      return normalized
    }
  }

  return QUIZ_OPTION_ID_VALUES[index]
}

function normalizeQuizPayload(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid quiz payload')
  }

  const quiz = Array.isArray((payload as any).quiz) ? (payload as any).quiz : []

  return {
    quiz: quiz.map((item: any) => ({
      question:
        typeof item?.question === 'string' ? item.question.trim() : '',
      options: Array.isArray(item?.options)
        ? item.options.slice(0, 4).map((option: any, index: number) => ({
            id: normalizeOptionId(option?.id, index),
            text: typeof option?.text === 'string' ? option.text.trim() : '',
          }))
        : [],
      correctOptionId: normalizeOptionId(item?.correctOptionId, 0),
      explanation:
        typeof item?.explanation === 'string' ? item.explanation.trim() : '',
    })),
  }
}

export function parseQuizResponse(text: string) {
  const extractedPayload = extractJSONObject(text)
  const normalizedPayload = normalizeQuizPayload(extractedPayload)

  return generateQuizResponseSchema.parse(normalizedPayload)
}
