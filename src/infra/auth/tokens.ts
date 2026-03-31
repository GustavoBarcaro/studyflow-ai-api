import { FastifyReply } from 'fastify'

type TokenUser = {
  id: string
  email: string
}

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

function parseExpiresInToMs(value: string | number): number {
  if (typeof value === 'number') {
    return value * 1000
  }

  const parsed = /^(\d+)([smhd])$/.exec(value.trim())

  if (!parsed) {
    throw new Error(
      'Invalid expiresIn format. Use number (seconds) or <number><s|m|h|d>.'
    )
  }

  const amount = Number(parsed[1])
  const unit = parsed[2]

  if (unit === 's') return amount * 1000
  if (unit === 'm') return amount * 60 * 1000
  if (unit === 'h') return amount * 60 * 60 * 1000

  return amount * 24 * 60 * 60 * 1000
}

export async function generateAuthTokens(
  reply: FastifyReply,
  user: TokenUser,
  sessionId: string
) {
  const accessToken = await reply.jwtSign(
    {
      sub: user.id,
      email: user.email,
      tokenType: 'access',
    },
    {
      sign: {
        sub: user.id,
        expiresIn: ACCESS_EXPIRES_IN,
      },
    }
  )

  const refreshToken = await reply.jwtSign(
    {
      sub: user.id,
      email: user.email,
      tokenType: 'refresh',
      sid: sessionId,
    },
    {
      sign: {
        sub: user.id,
        expiresIn: REFRESH_EXPIRES_IN,
      },
    }
  )

  const refreshTokenExpiresAt = new Date(
    Date.now() + parseExpiresInToMs(REFRESH_EXPIRES_IN)
  )

  return {
    accessToken,
    refreshToken,
    refreshTokenExpiresAt,
  }
}
