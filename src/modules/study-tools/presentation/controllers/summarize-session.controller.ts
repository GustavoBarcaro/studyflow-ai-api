import { GroqProvider } from '../../../../infra/services/ai/groq-provider'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SummarizeSessionParamsDTO } from '../../application/dto/summarize.dto'
import { SummarizeSessionUseCase } from '../../application/use-cases/summarize-session.use-case'
import { SessionsRepository } from '../../../sessions/repositories/sessions-repository'

export async function summarizeSessionController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as SummarizeSessionParamsDTO
  const userId = request.user.sub

  const sessionsRepository = new SessionsRepository()
  const aiProvider = new GroqProvider()
  const summarizeSessionUseCase = new SummarizeSessionUseCase(
    sessionsRepository,
    aiProvider
  )

  const result = await summarizeSessionUseCase.execute(id, userId)

  if (!result) {
    return reply.status(404).send({
      message: 'Session not found',
    })
  }

  return reply.send(result)
}
