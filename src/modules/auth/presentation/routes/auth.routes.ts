import { FastifyInstance } from 'fastify'
import { signUpController } from '../controllers/signup.controller'
import { loginController } from '../controllers/login.controller'
import { refreshTokenController } from '../controllers/refresh-token.controller'
import { logoutController } from '../controllers/logout.controller'
import {
  signUpBodySchema,
  signUpResponseSchema,
} from '../../application/dto/signup.dto'
import { loginBodySchema, loginResponseSchema } from '../../application/dto/login.dto'
import {
  refreshTokenBodySchema,
  refreshTokenResponseSchema,
} from '../../application/dto/refresh-token.dto'
import {
  logoutBodySchema,
  logoutResponseSchema,
} from '../../application/dto/logout.dto'

export async function authRoutes(app: FastifyInstance) {
  app.withTypeProvider().route({
    method: 'POST',
    url: '/signup',
    schema: {
      tags: ['auth'],
      summary: 'Create account',
      body: signUpBodySchema,
      response: {
        201: signUpResponseSchema,
      },
    },
    handler: signUpController,
  })


  app.withTypeProvider().route({
    method: 'POST',
    url: '/login',
    schema: {
      tags: ['auth'],
      summary: 'Login',
      body: loginBodySchema,
      response: {
        200: loginResponseSchema,
      },
    },
    handler: loginController,
  })

  app.withTypeProvider().route({
    method: 'POST',
    url: '/refresh',
    schema: {
      tags: ['auth'],
      summary: 'Refresh access token',
      body: refreshTokenBodySchema,
      response: {
        200: refreshTokenResponseSchema,
      },
    },
    handler: refreshTokenController,
  })

  app.withTypeProvider().route({
    method: 'POST',
    url: '/logout',
    schema: {
      tags: ['auth'],
      summary: 'Logout',
      body: logoutBodySchema,
      response: {
        200: logoutResponseSchema,
      },
    },
    handler: logoutController,
  })
}
