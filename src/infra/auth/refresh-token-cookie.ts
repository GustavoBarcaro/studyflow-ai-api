import { FastifyReply } from 'fastify'

const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'
const REFRESH_TOKEN_COOKIE_NAME =
  process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken'

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

export function getRefreshTokenCookieName() {
  return REFRESH_TOKEN_COOKIE_NAME
}

export function getRefreshTokenCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(parseExpiresInToMs(REFRESH_EXPIRES_IN) / 1000),
  }
}

export function setRefreshTokenCookie(
  reply: FastifyReply,
  refreshToken: string
) {
  reply.setCookie(
    getRefreshTokenCookieName(),
    refreshToken,
    getRefreshTokenCookieOptions()
  )
}

export function clearRefreshTokenCookie(reply: FastifyReply) {
  reply.clearCookie(
    getRefreshTokenCookieName(),
    getRefreshTokenCookieOptions()
  )
}
