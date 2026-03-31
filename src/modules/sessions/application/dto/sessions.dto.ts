import { z } from 'zod'

export const sessionParamsSchema = z.object({
  id: z.string().uuid(),
})

export const messageSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  role: z.string(),
  content: z.string(),
  createdAt: z.date(),
})

export const messagesListResponseSchema = z.array(messageSchema)

export const sessionTopicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string().nullable().optional(),
})

export const sessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  topicId: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const sessionResponseSchema = sessionSchema.extend({
  topic: sessionTopicSchema,
})

export const sessionDetailsResponseSchema = sessionResponseSchema.extend({
  messages: z.array(messageSchema),
})

export const sessionsListResponseSchema = z.array(sessionResponseSchema)

export const createSessionBodySchema = z.object({
  title: z.string().min(1),
  topicId: z.string().uuid(),
})

export const createSessionDataSchema = z.object({
  title: z.string().min(1),
  topicId: z.string().uuid(),
  userId: z.string().uuid(),
})

export const createMessageBodySchema = z.object({
  content: z.string().min(1),
})

export const createMessageDataSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.string().min(1),
  content: z.string().min(1),
})

export const createMessageResponseSchema = z.object({
  userMessage: messageSchema,
  assistantMessage: messageSchema,
})

export type SessionParamsDTO = z.infer<typeof sessionParamsSchema>
export type CreateSessionBodyDTO = z.infer<typeof createSessionBodySchema>
export type CreateSessionDataDTO = z.infer<typeof createSessionDataSchema>
export type CreateMessageBodyDTO = z.infer<typeof createMessageBodySchema>
export type CreateMessageDataDTO = z.infer<typeof createMessageDataSchema>
