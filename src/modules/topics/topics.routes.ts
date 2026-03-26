import { FastifyInstance } from 'fastify'
import { createTopicSchema } from './topics.schema'
import { createTopic } from './topics.controller'

export async function topicsRoutes(app: FastifyInstance) {
  app.post('/topics', async (req, reply) => {
    const body = createTopicSchema.parse(req.body)

    const topic = await createTopic(body as any)

    return reply.send(topic)
  })
}