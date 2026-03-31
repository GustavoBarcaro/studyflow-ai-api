import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import jwtPlugin from './infra/auth/jwt'
import authenticatePlugin from './infra/auth/authenticate'
import { authRoutes } from './modules/auth/presentation/routes/auth.routes'
import { sessionsRoutes } from './modules/sessions/presentation/routes/sessions.routes'
import { studyToolsRoutes } from './modules/study-tools/presentation/routes/study-tools.routes'
import { topicsRoutes } from './modules/topics/presentation/routes/topics.routes'

export async function buildApp() {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>()

  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true)
      if (allowedOrigins.includes(origin)) return cb(null, true)
      return cb(new Error('Not allowed by CORS'), false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

    await app.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'StudyFlow API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  })

  await app.register(swaggerUI, {
    routePrefix: '/swagger/docs',
  })

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error)
    reply.status(500).send({
      message: (error as any).message,
    })
  })

  await app.register(cookie)
  await app.register(jwtPlugin)
  await app.register(authenticatePlugin)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  await app.register(authRoutes)
  await app.register(topicsRoutes)
  await app.register(sessionsRoutes)
  await app.register(studyToolsRoutes)

  return app
}
