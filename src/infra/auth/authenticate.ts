import fp from 'fastify-plugin'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function authenticatePlugin(app: FastifyInstance) {
  app.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
      } catch {
        return reply.status(401).send({
          message: 'Unauthorized',
        })
      }
    }
  )
}

export default fp(authenticatePlugin)