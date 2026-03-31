import { AIProvider } from '../../../../infra/services/ai/ai-provider'
import { MESSAGE_ROLES } from '../../../../shared/constants/message-roles'
import { QuizDifficulty } from '../../../../shared/constants/quiz-difficulties'
import {
  buildGenerateQuizPrompt,
  buildStudySessionTitlePrompt,
  buildStudyTopicPrompt,
} from '../../../../shared/prompts/study-prompts'
import { buildSessionContext } from '../../../../shared/utils/build-session-context'
import { generateQuizResponseSchema } from '../dto/quiz.dto'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'

type GenerateQuizInput = {
  sessionId: string
  userId: string
  questions: number
  difficulty: QuizDifficulty
}

export class GenerateQuizUseCase {
  constructor(
    private sessionsRepository: SessionsRepository,
    private aiProvider: AIProvider
  ) {}

  async execute(input: GenerateQuizInput) {
    const session = await this.sessionsRepository.findByIdAndUserId(
      input.sessionId,
      input.userId
    )

    if (!session) {
      return null
    }

    const contextMessages = buildSessionContext(session.messages)

    const response = await this.aiProvider.generateObject({
      messages: [
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildGenerateQuizPrompt(
            input.questions,
            input.difficulty
          ),
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildStudyTopicPrompt(session.topic.name),
        },
        {
          role: MESSAGE_ROLES.SYSTEM,
          content: buildStudySessionTitlePrompt(session.title),
        },
        ...contextMessages,
      ],
      schema: generateQuizResponseSchema,
      schemaName: 'study_session_quiz',
      schemaDescription:
        'A structured multiple-choice quiz generated from a study session.',
    })

    return response.object
  }
}
