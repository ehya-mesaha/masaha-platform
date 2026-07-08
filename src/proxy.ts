import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('masaha_token')?.value
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
      const { payload } = await jwtVerify(token, SECRET)
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
    } catch {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/seller/:path*', '/buyer/:path*', '/admin/:path*'],
}
