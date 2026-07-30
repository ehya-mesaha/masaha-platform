import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'
import {
  getJwtSecret,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  sessionCookieOptions,
} from '@/lib/session'

const SESSION_REFRESH_AFTER_SECONDS = 60 * 60 * 24

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  const pathname = req.nextUrl.pathname

  if (
    pathname.startsWith('/seller') ||
    pathname.startsWith('/buyer') ||
    pathname.startsWith('/admin')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    try {
      const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: ['HS256'] })
      if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url))
      }
      if (
        pathname.startsWith('/seller') &&
        payload.role !== 'SELLER' &&
        payload.role !== 'ADMIN'
      ) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      if (
        pathname.startsWith('/buyer') &&
        payload.role !== 'BUYER' &&
        payload.role !== 'ADMIN'
      ) {
        return NextResponse.redirect(new URL('/', req.url))
      }

      const response = NextResponse.next()
      const issuedAt = typeof payload.iat === 'number' ? payload.iat : 0
      const now = Math.floor(Date.now() / 1000)
      if (now - issuedAt >= SESSION_REFRESH_AFTER_SECONDS) {
        const sessionPayload = { ...payload }
        delete sessionPayload.exp
        delete sessionPayload.iat
        delete sessionPayload.nbf
        const refreshedToken = await new SignJWT(sessionPayload)
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
          .sign(getJwtSecret())
        response.cookies.set(SESSION_COOKIE_NAME, refreshedToken, sessionCookieOptions())
      }
      return response
    } catch {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/seller/:path*', '/buyer/:path*', '/admin/:path*'],
}
