import { SignJWT, jwtVerify } from 'jose'
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
