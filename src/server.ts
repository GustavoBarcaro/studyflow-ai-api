import Fastify from 'fastify'
import cors from '@fastify/cors'
import { topicsRoutes } from './modules/topics/topics.routes'

const app = Fastify()

app.register(cors)
app.register(topicsRoutes)

app.get('/health', async () => {
  return { status: 'ok' }
})

app.listen({ port: 3000, host: '0.0.0.0' }).then(() => {
  console.log('Server running on http://0.0.0.0:3000')
})