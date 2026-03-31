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
- `PORT`: API port
- `NODE_ENV`: runtime environment
- `TFVARS_FILE`: Terraform variable file used by Docker provisioning

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
PORT=3333
NODE_ENV=development
TFVARS_FILE=environments/dev.tfvars
```

The Terraform container writes a generated file containing only the final `DATABASE_URL`. The other runtime variables such as `JWT_SECRET`, `PORT`, and `NODE_ENV` continue to come from your `.env`.

## Start Locally Without Docker

If you want to run the API directly on your machine:

1. create `.env`
2. make sure `DATABASE_URL` points to a valid Prisma Postgres connection string
3. install dependencies
4. push the schema
5. start the dev server

Commands:

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

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
- the generated Prisma connection string is sensitive and should never be committed
