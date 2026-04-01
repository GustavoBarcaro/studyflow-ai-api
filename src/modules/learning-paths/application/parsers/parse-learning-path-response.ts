import { generatedLearningPathSchema } from '../dto/learning-path.dto'

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

  throw new Error('Invalid learning path JSON returned by AI')
}

export function parseLearningPathResponse(text: string) {
  const payload = extractJSONObject(text) as {
    title?: unknown
    description?: unknown
    steps?: Array<{
      title?: unknown
      description?: unknown
      order?: unknown
    }>
  }

  const normalizedSteps = Array.isArray(payload.steps)
    ? payload.steps
        .map((step, index) => ({
          title: typeof step?.title === 'string' ? step.title.trim() : '',
          description:
            typeof step?.description === 'string'
              ? step.description.trim()
              : '',
          order:
            typeof step?.order === 'number' && Number.isInteger(step.order)
              ? step.order
              : index + 1,
        }))
        .sort((a, b) => a.order - b.order)
        .map((step, index) => ({
          ...step,
          order: index + 1,
        }))
    : []

  return generatedLearningPathSchema.parse({
    title: typeof payload.title === 'string' ? payload.title.trim() : '',
    description:
      typeof payload.description === 'string' ? payload.description.trim() : '',
    steps: normalizedSteps,
  })
}
