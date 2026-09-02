import { SignJWT, jwtVerify } from 'jose'
import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import {
  getJwtSecret,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/session'

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, sessionCookieOptions } from '@/lib/session'

export async function signToken(payload: object) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret())
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ['HS256'] })
  return payload
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}

export type TokenPayload = {
  id: string
  email: string
  role: 'ADMIN' | 'SELLER' | 'BUYER'
  name: string
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL'
}

const EMAIL_VERIFICATION_PURPOSE = 'verify-email'
const PASSWORD_RESET_PURPOSE = 'reset-password'

export async function signEmailVerificationToken(userId: string) {
  return new SignJWT({ purpose: EMAIL_VERIFICATION_PURPOSE, userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('48h')
    .sign(getJwtSecret())
}

export async function verifyEmailVerificationToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ['HS256'] })
  if (payload.purpose !== EMAIL_VERIFICATION_PURPOSE || typeof payload.userId !== 'string') {
    throw new Error('Invalid verification token')
  }
  return payload.userId
}

function passwordResetVersion(userId: string, passwordHash: string) {
  return createHmac('sha256', getJwtSecret())
    .update(`${userId}:${passwordHash}`)
    .digest('base64url')
}

export async function signPasswordResetToken(userId: string, passwordHash: string) {
  return new SignJWT({
    purpose: PASSWORD_RESET_PURPOSE,
    userId,
    version: passwordResetVersion(userId, passwordHash),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(getJwtSecret())
}

export async function verifyPasswordResetToken(token: string): Promise<{ userId: string; version: string }> {
  const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ['HS256'] })
  if (
    payload.purpose !== PASSWORD_RESET_PURPOSE ||
    typeof payload.userId !== 'string' ||
    typeof payload.version !== 'string'
  ) {
    throw new Error('Invalid password reset token')
  }
  return { userId: payload.userId, version: payload.version }
}

export function isPasswordResetTokenCurrent(userId: string, passwordHash: string, version: string) {
  return passwordResetVersion(userId, passwordHash) === version
}
