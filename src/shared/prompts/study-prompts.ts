import { QuizDifficulty } from '../constants/quiz-difficulties'
import { StudyLevel } from '../constants/study-levels'

export const CHAT_SYSTEM_PROMPT = `
You are a senior software engineer and tutor.

Rules:
- explain in simple terms
- always give examples
- keep answers concise
- if the user makes a typo, assume intent and correct silently
- adapt explanation for beginners
`.trim()

export const SUMMARIZE_SESSION_PROMPT = `
Summarize this study session clearly.

Rules:
- keep it concise
- organize in bullet points
- highlight key concepts
- mention mistakes or confusions if present
`.trim()

export function buildExplainAgainPrompt(
  level: StudyLevel,
  focus?: string
) {
  return `
Explain this topic again.

Rules:
- adapt for ${level}
- use simple language
- include one practical example
- focus especially on: ${focus || 'the main confusing parts'}
`.trim()
}

export function buildStudyTopicPrompt(topic: string) {
  return `The user is studying: ${topic}`
}

export function buildStudySessionTitlePrompt(sessionTitle: string) {
  return `Current session title: ${sessionTitle}`
}

export function buildGenerateQuizPrompt(
  questions: number,
  difficulty: QuizDifficulty
) {
  return `
You are an expert programming tutor.

Generate exactly ${questions} multiple choice questions based on the study session.

Rules:
- Difficulty level: ${difficulty}
- Focus on understanding, not memorization
- Each question must have exactly 4 options
- Each option must have an id: "A", "B", "C", or "D"
- Only one option can be correct
- correctOptionId must match one of the option ids
- Include a short explanation

IMPORTANT:
- Return ONLY valid JSON
- Do NOT include markdown
- Do NOT include text before or after JSON

JSON format:

{
  "quiz": [
    {
      "question": "string",
      "options": [
        { "id": "A", "text": "string" },
        { "id": "B", "text": "string" },
        { "id": "C", "text": "string" },
        { "id": "D", "text": "string" }
      ],
      "correctOptionId": "A",
      "explanation": "string"
    }
  ]
}
`.trim()
}
