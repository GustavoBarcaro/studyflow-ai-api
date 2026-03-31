# StudyFlow AI API

Backend API for StudyFlow, a study assistant product where each user organizes subjects into topics, opens study sessions inside those topics, and stores the message history of each session.

## Product Idea

StudyFlow is structured around three core entities:

- `Topic`: a study area such as Math, Biology, History, or Interview Prep
- `StudySession`: a conversation or study workspace created inside one topic
- `Message`: each interaction stored inside a session

Rules enforced by the API:

- a topic belongs to a user
- a session belongs to a user
- a session must belong to a topic owned by that same user
- a message must belong to a session owned by that user

This gives each user an isolated study workspace with a clean hierarchy:

`User -> Topics -> Sessions -> Messages`

## Stack

- Node.js
- Fastify
- Prisma ORM
- Prisma Postgres via Terraform provider
- Docker Compose
- TypeScript

## Environment Variables

Create your local env file from the example:

```bash
cp .env.example .env
```

The project uses these keys:

- `PRISMA_SERVICE_TOKEN`: token used by the Terraform Prisma provider to provision the database and generate the connection string
- `DATABASE_URL`: Prisma connection string used by the app and by `prisma db push`
- `JWT_SECRET`: secret used to sign access and refresh tokens
- `JWT_ACCESS_EXPIRES_IN`: access token expiration, for example `15m`
- `JWT_REFRESH_EXPIRES_IN`: refresh token expiration, for example `7d`
- `CORS_ORIGINS`: comma-separated list of allowed frontend origins for cross-origin requests with cookies, for example `http://localhost:3000`
- `GROQ_API_KEY`: API key for the Groq provider
- `GROQ_MODEL`: default Groq model used by the AI provider
- `GROQ_BASE_URL`: Groq API base URL
- `PORT`: API port
- `NODE_ENV`: runtime environment
- `TFVARS_FILE`: Terraform variable file used by Docker provisioning

## How To Get The Groq Key

The API uses Groq as the LLM provider for the study session chat flow.

To use it:

1. create an account in Groq
2. open the API keys area in the Groq dashboard
3. generate a new API key
4. copy the key and add it to your `.env`

Example:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

### How The Project Uses Groq

When you send a message to:

```text
POST /sessions/:id/messages
```

the backend:

- saves the user's message
- loads the existing session history
- sends that history to the Groq provider
- saves the assistant response as a new message
- returns both the user message and the assistant message

If `GROQ_API_KEY` is missing, this flow will fail at runtime.

## How To Get The Prisma Key

This repository is set up to provision a Prisma Postgres database through Terraform. For that flow, you need the Prisma service token in `.env`:

```env
PRISMA_SERVICE_TOKEN=your_prisma_service_token
```

In this codebase, that is the key the Terraform provider reads when running the `terraform` container.

After Terraform runs, it generates the Prisma connection string automatically. You do not need to manually build `DATABASE_URL` for the Docker flow.

If you want to inspect or reuse the generated connection string manually, run:

```bash
cd iac/database
terraform output -raw connection_string
```

That output is the value you can place into:

```env
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=...
```

## Start With Docker

The Docker flow does three things in sequence:

1. provisions the Prisma Postgres database with Terraform
2. generates `DATABASE_URL`
3. pushes the Prisma schema and starts the API

Start everything with:

```bash
docker compose up --build
```

API endpoints will be available at:

```text
http://localhost:3333
```

Swagger UI will be available at:

```text
http://localhost:3333/swagger/docs
```

### What Docker Uses From `.env`

For the Docker flow, make sure `.env` contains at least:

```env
PRISMA_SERVICE_TOKEN=your_prisma_service_token
JWT_SECRET=replace_with_a_long_random_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_BASE_URL=https://api.groq.com/openai/v1
PORT=3333
NODE_ENV=development
TFVARS_FILE=environments/dev.tfvars
```

The Terraform container writes a generated file containing only the final `DATABASE_URL`. The other runtime variables such as `JWT_SECRET`, `PORT`, and `NODE_ENV` continue to come from your `.env`.

## Start Locally Without Docker

If you want to run the API directly on your machine:

1. create `.env`
2. make sure `DATABASE_URL` points to a valid Prisma Postgres connection string
3. make sure `GROQ_API_KEY` is set if you want AI responses in session messages
4. install dependencies
5. push the schema
6. start the dev server

Commands:

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

For local frontend integration, the API currently expects the frontend origin in `CORS_ORIGINS`. The initial recommended value is:

```env
CORS_ORIGINS=http://localhost:3000
```

If you add more frontend origins later, separate them with commas.

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:push
```

## Notes

- `docker compose up --build` is the simplest path for a fresh setup
- `DATABASE_URL` is required for local non-Docker execution
- `CORS_ORIGINS` must include your frontend origin when sending cookies across origins
- `GROQ_API_KEY` is required for `POST /sessions/:id/messages` to generate an AI reply
- the generated Prisma connection string is sensitive and should never be committed
