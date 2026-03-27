import 'fastify'
import '@fastify/jwt'


export type JWTPayload = {
  sub: string
  email: string
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }

  interface FastifyRequest {
    user: JWTPayload
  }
}


declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string
      email: string
    }
    user: {
      sub: string
      email: string
    }
  }
}