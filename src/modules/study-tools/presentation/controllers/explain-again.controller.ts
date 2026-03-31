import { GroqProvider } from '../../../../infra/services/ai/groq-provider'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  ExplainAgainBodyDTO,
  ExplainAgainParamsDTO,
} from '../../application/dto/explain-again.dto'
import { ExplainAgainUseCase } from '../../application/use-cases/explain-again.use-case'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'

export async function explainAgainController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as ExplainAgainParamsDTO
  const { focus, level } = request.body as ExplainAgainBodyDTO
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const aiProvider = new GroqProvider()
  const explainAgainUseCase = new ExplainAgainUseCase(
    sessionsRepository,
    aiProvider
  )

  const result = await explainAgainUseCase.execute({
    sessionId: id,
    userId,
    focus,
    level,
  })

  if (!result) {
    return reply.status(404).send({
      message: 'Session not found',
    })
  }

  return reply.send(result)
}
