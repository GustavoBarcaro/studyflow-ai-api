import { FastifyInstance } from 'fastify'
import { createTopicController } from '../controllers/create-topic.controller'
import {
  createTopicBodySchema,
  createTopicResponseSchema,
} from '../../application/dto/create-topic.dto'

export async function topicsRoutes(app: FastifyInstance) {
  app.withTypeProvider().route({
    method: 'POST',
    url: '/topics',
    schema: {
      tags: ['topics'],
      summary: 'Create topic',
      security: [{ bearerAuth: [] }],
      body: createTopicBodySchema,
      response: {
        201: createTopicResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: createTopicController,
  })
}