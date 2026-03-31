import { FastifyInstance } from 'fastify'
import { createTopicController } from '../controllers/create-topic.controller'
import { deleteTopicController } from '../controllers/delete-topic.controller'
import { getTopicController } from '../controllers/get-topic.controller'
import { getTopicsController } from '../controllers/get-topics.controller'
import { updateTopicController } from '../controllers/update-topic.controller'
import {
  createTopicBodySchema,
  createTopicResponseSchema,
  getTopicsResponseSchema,
  topicParamsSchema,
  topicResponseSchema,
  updateTopicBodySchema,
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

  app.withTypeProvider().route({
    method: 'GET',
    url: '/topics',
    schema: {
      tags: ['topics'],
      summary: 'Get topics',
      security: [{ bearerAuth: [] }],
      response: {
        200: getTopicsResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: getTopicsController,
  })

  app.withTypeProvider().route({
    method: 'GET',
    url: '/topics/:id',
    schema: {
      tags: ['topics'],
      summary: 'Get topic by id',
      security: [{ bearerAuth: [] }],
      params: topicParamsSchema,
      response: {
        200: topicResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: getTopicController,
  })

  app.withTypeProvider().route({
    method: 'PATCH',
    url: '/topics/:id',
    schema: {
      tags: ['topics'],
      summary: 'Update topic',
      security: [{ bearerAuth: [] }],
      params: topicParamsSchema,
      body: updateTopicBodySchema,
      response: {
        200: topicResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: updateTopicController,
  })

  app.withTypeProvider().route({
    method: 'DELETE',
    url: '/topics/:id',
    schema: {
      tags: ['topics'],
      summary: 'Delete topic',
      security: [{ bearerAuth: [] }],
      params: topicParamsSchema,
      response: {
        204: topicResponseSchema.nullable(),
      },
    },
    onRequest: [app.authenticate],
    handler: deleteTopicController,
  })
}
