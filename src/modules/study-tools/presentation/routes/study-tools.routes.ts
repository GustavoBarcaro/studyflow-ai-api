import { FastifyInstance } from 'fastify'
import {
  explainAgainBodySchema,
  explainAgainParamsSchema,
  explainAgainResponseSchema,
} from '../../application/dto/explain-again.dto'
import {
  generateQuizBodySchema,
  generateQuizParamsSchema,
  generateQuizResponseSchema,
} from '../../application/dto/quiz.dto'
import {
  summarizeSessionParamsSchema,
  summarizeSessionResponseSchema,
} from '../../application/dto/summarize.dto'
import { explainAgainController } from '../controllers/explain-again.controller'
import { generateQuizController } from '../controllers/generate-quiz.controller'
import { summarizeSessionController } from '../controllers/summarize-session.controller'

export async function studyToolsRoutes(app: FastifyInstance) {
  app.withTypeProvider().route({
    method: 'POST',
    url: '/sessions/:id/summarize',
    schema: {
      tags: ['study-tools'],
      summary: 'Summarize session',
      security: [{ bearerAuth: [] }],
      params: summarizeSessionParamsSchema,
      response: {
        200: summarizeSessionResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: summarizeSessionController,
  })

  app.withTypeProvider().route({
    method: 'POST',
    url: '/sessions/:id/explain-again',
    schema: {
      tags: ['study-tools'],
      summary: 'Explain session topic again',
      security: [{ bearerAuth: [] }],
      params: explainAgainParamsSchema,
      body: explainAgainBodySchema,
      response: {
        200: explainAgainResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: explainAgainController,
  })

  app.withTypeProvider().route({
    method: 'POST',
    url: '/sessions/:id/quiz',
    schema: {
      tags: ['study-tools'],
      summary: 'Generate quiz from session',
      security: [{ bearerAuth: [] }],
      params: generateQuizParamsSchema,
      body: generateQuizBodySchema,
      response: {
        200: generateQuizResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: generateQuizController,
  })
}
