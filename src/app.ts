import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwtPlugin from './infra/auth/jwt'
import authenticatePlugin from './infra/auth/authenticate'
import { authRoutes } from './modules/auth/presentation/routes/auth.routes'
import { topicsRoutes } from './modules/topics/presentation/routes/topics.routes'

export async function buildApp() {
  const app = Fastify({
    logger: true,
  })

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error)
    reply.status(500).send({
      message: (error as any).message,
    })
  })
  await app.register(cors)
  await app.register(jwtPlugin)
  await app.register(authenticatePlugin)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  await app.register(authRoutes)
  await app.register(topicsRoutes)

  return app
}