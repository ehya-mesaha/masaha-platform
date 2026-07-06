import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function signToken(payload: object) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET)
  return payload
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('masaha_token')?.value
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
