export const SESSION_COOKIE_NAME = 'masaha_token'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export function getJwtSecret() {
  const value = process.env.JWT_SECRET
  if (!value || value.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters')
  }
  return new TextEncoder().encode(value)
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  }
}
