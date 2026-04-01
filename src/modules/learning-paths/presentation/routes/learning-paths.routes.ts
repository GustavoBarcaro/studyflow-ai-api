import { FastifyInstance } from 'fastify'
import {
  createLearningPathBodySchema,
  learningPathResponseSchema,
  learningPathStepParamsSchema,
  learningPathStepSchema,
  topicLearningPathParamsSchema,
} from '../../application/dto/learning-path.dto'
import { completeLearningPathStepController } from '../controllers/complete-learning-path-step.controller'
import { createLearningPathController } from '../controllers/create-learning-path.controller'
import { getLearningPathByTopicController } from '../controllers/get-learning-path-by-topic.controller'
import { incompleteLearningPathStepController } from '../controllers/incomplete-learning-path-step.controller'

export async function learningPathsRoutes(app: FastifyInstance) {
  app.withTypeProvider().route({
    method: 'POST',
    url: '/topics/:id/learning-path',
    schema: {
      tags: ['learning-paths'],
      summary: 'Generate learning path for topic',
      security: [{ bearerAuth: [] }],
      params: topicLearningPathParamsSchema,
      body: createLearningPathBodySchema,
      response: {
        200: learningPathResponseSchema,
        201: learningPathResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: createLearningPathController,
  })

  app.withTypeProvider().route({
    method: 'GET',
    url: '/topics/:id/learning-path',
    schema: {
      tags: ['learning-paths'],
      summary: 'Get learning path for topic',
      security: [{ bearerAuth: [] }],
      params: topicLearningPathParamsSchema,
      response: {
        200: learningPathResponseSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: getLearningPathByTopicController,
  })

  app.withTypeProvider().route({
    method: 'PATCH',
    url: '/learning-path-steps/:id/complete',
    schema: {
      tags: ['learning-paths'],
      summary: 'Mark learning path step as complete',
      security: [{ bearerAuth: [] }],
      params: learningPathStepParamsSchema,
      response: {
        200: learningPathStepSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: completeLearningPathStepController,
  })

  app.withTypeProvider().route({
    method: 'PATCH',
    url: '/learning-path-steps/:id/incomplete',
    schema: {
      tags: ['learning-paths'],
      summary: 'Mark learning path step as incomplete',
      security: [{ bearerAuth: [] }],
      params: learningPathStepParamsSchema,
      response: {
        200: learningPathStepSchema,
      },
    },
    onRequest: [app.authenticate],
    handler: incompleteLearningPathStepController,
  })
}
