import { GroqProvider } from '../../../../infra/services/ai/groq-provider'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  GenerateQuizBodyDTO,
  GenerateQuizParamsDTO,
} from '../../application/dto/quiz.dto'
import { GenerateQuizUseCase } from '../../application/use-cases/generate-quiz.use-case'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'

export async function generateQuizController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as GenerateQuizParamsDTO
  const { questions, difficulty } = request.body as GenerateQuizBodyDTO
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const aiProvider = new GroqProvider()
  const generateQuizUseCase = new GenerateQuizUseCase(
    sessionsRepository,
    aiProvider
  )

  const result = await generateQuizUseCase.execute({
    sessionId: id,
    userId,
    questions,
    difficulty,
  })

  if (!result) {
    return reply.status(404).send({
      message: 'Session not found',
    })
  }

  return reply.send(result)
}
