import { FastifyInstance } from 'fastify'
import { createTopicController } from '../controllers/create-topic.controller'

export async function topicsRoutes(app: FastifyInstance) {
  app.post(
    '/topics',
    {
      onRequest: [app.authenticate],
    },
    createTopicController
  )
}