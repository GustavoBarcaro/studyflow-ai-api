import { buildApp } from './app'

async function bootstrap() {
  const app = await buildApp()

  await app.listen({
    port: Number(process.env.PORT || 3000),
    host: '0.0.0.0',
  })

  console.log(`Server running on http://0.0.0.0:${process.env.PORT || 3000}`)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})