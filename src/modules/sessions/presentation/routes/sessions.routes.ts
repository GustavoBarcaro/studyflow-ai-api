import { FastifyInstance } from 'fastify'
import {
  createMessageBodySchema,
  createMessageResponseSchema,
  createSessionBodySchema,
  messageSchema,
  messagesListResponseSchema,
  sessionDetailsResponseSchema,
  sessionParamsSchema,
  sessionResponseSchema,
  sessionsListResponseSchema,
} from '../../application/dto/sessions.dto'
import { createMessageController } from '../controllers/create-message.controller'
import { createSessionController } from '../controllers/create-session.controller'
import { deleteSessionController } from '../controllers/delete-session.controller'
import { getSessionController } from '../controllers/get-session.controller'
import { getSessionMessagesController } from '../controllers/get-session-messages.controller'
import { getSessionsController } from '../controllers/get-sessions.controller'

export async function sessionsRoutes(app: FastifyInstance) {
  app.withTypeProvider().route({
    method: 'POST',
    url: '/sessions',
    schema: {
      tags: ['sessions'],
      summary: 'Create session',
      security: [{ bearerAuth: [] }],
      body: createSessionBodySchema,
      response: {
        201: sessionResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: createSessionController,
  })

  app.withTypeProvider().route({
    method: 'GET',
    url: '/sessions',
    schema: {
      tags: ['sessions'],
      summary: 'Get sessions',
      security: [{ bearerAuth: [] }],
      response: {
        200: sessionsListResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: getSessionsController,
  })

  app.withTypeProvider().route({
    method: 'GET',
    url: '/sessions/:id',
    schema: {
      tags: ['sessions'],
      summary: 'Get session by id',
      security: [{ bearerAuth: [] }],
      params: sessionParamsSchema,
      response: {
        200: sessionDetailsResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: getSessionController,
  })

  app.withTypeProvider().route({
    method: 'DELETE',
    url: '/sessions/:id',
    schema: {
      tags: ['sessions'],
      summary: 'Delete session',
      security: [{ bearerAuth: [] }],
      params: sessionParamsSchema,
      response: {
        204: sessionResponseSchema.nullable(),
      },
    },
    onRequest: [app.authenticate],
    handler: deleteSessionController,
  })

  app.withTypeProvider().route({
    method: 'POST',
    url: '/sessions/:id/messages',
    schema: {
      tags: ['sessions'],
      summary: 'Create message in session',
      security: [{ bearerAuth: [] }],
      params: sessionParamsSchema,
      body: createMessageBodySchema,
      response: {
        201: createMessageResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: createMessageController,
  })

  app.withTypeProvider().route({
    method: 'GET',
    url: '/sessions/:id/messages',
    schema: {
      tags: ['sessions'],
      summary: 'Get session messages',
      security: [{ bearerAuth: [] }],
      params: sessionParamsSchema,
      response: {
        200: messagesListResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: getSessionMessagesController,
  })
}
