import { FastifyInstance } from 'fastify'
import { loginController } from '../controllers/login.controller'
import { signUpController } from '../controllers/signup.controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', loginController)
  app.post('/signup', signUpController)
}
