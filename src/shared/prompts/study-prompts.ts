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

export function buildLearningPathPrompt(
  learningPathTitle: string,
  learningPathDescription: string
) {
  return `Current learning path: ${learningPathTitle}. ${learningPathDescription}`
}

export function buildLearningPathStepPrompt(
  stepTitle: string,
  stepDescription: string
) {
  return `Target learning path step: ${stepTitle}. ${stepDescription}`
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

Do not use markdown.
Do not include any text before or after the JSON.

`.trim()
}

export function buildGenerateLearningPathPrompt(goal?: string) {
  return `
You are an expert programming tutor.

Your task is to create a structured learning path for a student.

Context:
- The study topic is provided separately
- Recent study session content is provided separately
- Build the path based on what the student is currently learning and what should come next
- Student goal: ${goal || 'infer the most likely next goal from the study context'}

Rules:
- Generate between 4 and 6 steps
- Order the steps from beginner to more advanced
- Each step must represent one clear concept or milestone
- Titles must be short and practical
- Descriptions must be concise and limited to 1 sentence
- Avoid generic or overly broad steps
- Focus on real learning progression
- If the study context is focused on one subtopic, keep the path focused on that subtopic instead of the entire topic
- Return a short path title
- Return a short path description

Return ONLY valid JSON in this exact format:

{
  "title": "string",
  "description": "string",
  "steps": [
    {
      "title": "string",
      "description": "string",
      "order": 1
    }
  ]
}

Do not use markdown.
Do not include any text before or after the JSON.
`.trim()
}
