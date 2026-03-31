import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { signUpController } from '../controllers/signup.controller'
import { loginController } from '../controllers/login.controller'
import {
  signUpBodySchema,
  signUpResponseSchema,
} from '../../application/dto/signup.dto'
import { loginBodySchema, loginResponseSchema } from '../../application/dto/login.dto'


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
}